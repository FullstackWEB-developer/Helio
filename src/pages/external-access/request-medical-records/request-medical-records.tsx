import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '../../patients/store/patients.selectors';
import Button from '../../../shared/components/button/button';
import withErrorLogging from '../../../shared/HOC/with-error-logging';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import Radio from '@components/radio/radio';
import {Option} from '@components/option/option';
import RequestMedicalRecordDateSelection
    from '@pages/external-access/request-medical-records/request-medical-record-date-selection';
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import ControlledInput from '@components/controllers/ControllerInput';
import {useForm} from 'react-hook-form';
import {DownloadMedicalRecordsProps, prepareAndDownloadMedicalRecords} from '@pages/patients/services/patients.service';
import {useLocation} from 'react-router-dom';
import {useMutation} from 'react-query';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import {MedicalRecordPreviewModel} from '@pages/external-access/models/medical-record-preview.model';
import {setMedicalRecordsPreviewData} from '@pages/external-access/request-medical-records/store/medical-records.slice';
import dayjs from 'dayjs';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';

const RequestMedicalRecords = () => {

    enum DateOptions {
        AllTime = 1,
        DateRange
    }

    const patient = useSelector(selectVerifiedPatent);
    const [selectedDateOption, setSelectedDateOption] = useState<DateOptions>(DateOptions.AllTime);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs().add(-1, 'month').toDate());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const location = useLocation<{ request: RedirectLink }>();
    const dispatch = useDispatch();
    const {control, formState, getValues, watch} = useForm({
        mode: 'onBlur'
    });
    const {t} = useTranslation();

    const email = watch('email');
    const emailConfirm = watch('email_confirm');
    const timeOptions: Option[] = [
        {
            value: DateOptions.AllTime.toString(),
            label: 'external_access.medical_records_request.all_time',
            object: DateOptions.AllTime
        },
        {
            value: DateOptions.DateRange.toString(),
            label: 'external_access.medical_records_request.select_date_range',
            object: DateOptions.DateRange
        }
    ]

    const datesSelected = (fieldName: string, date: Date) => {
        if (fieldName === 'startDate') {
            setSelectedStartDate(date);
        } else if (fieldName === 'endDate') {
            setSelectedEndDate(date);
        }
    }

    const downloadZipMutation = useMutation(prepareAndDownloadMedicalRecords);

    const downloadOrShare = (isDownload: boolean) => {
        let variables: DownloadMedicalRecordsProps = {
            patientId: patient.patientId,
            departmentId: patient.departmentId,
            downloadLink: location.state.request.linkId,
            isDownload,
            emailAddress: getValues('email')
        };
        if (selectedDateOption === DateOptions.DateRange) {
            variables = {
                ...variables,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
            }
        }
        downloadZipMutation.mutate(variables,
            {
                onSuccess: () => {
                    if (isDownload) {
                        dispatch(addSnackbarMessage({
                            message: 'external_access.medical_records_request.file_downloaded',
                            type: SnackbarType.Success
                        }));
                    }
                    if (!isDownload) {
                        dispatch(addSnackbarMessage({
                            message: 'external_access.medical_records_request.email_sent_successfully',
                            type: SnackbarType.Success
                        }));
                    }
                },
                onError: () => {
                    if (isDownload) {
                        dispatch(addSnackbarMessage({
                            message: 'external_access.medical_records_request.file_download_failed',
                            type: SnackbarType.Error
                        }));
                    }
                    if (!isDownload) {
                        dispatch(addSnackbarMessage({
                            message: 'external_access.medical_records_request.email_sent_failed',
                            type: SnackbarType.Error
                        }));
                    }
                }
            });
    }

    const previewHtml = () => {
        let data : MedicalRecordPreviewModel = {
            patientId: patient.patientId,
            departmentId: patient.departmentId
        };
        if (selectedDateOption === DateOptions.DateRange) {
            data = {
                ...data,
                startDate: selectedStartDate,
                endDate: selectedEndDate
            }
        }
        dispatch(setMedicalRecordsPreviewData(data));
        window.open('/medical-records-preview', '_blank');
    }

    return <div className='flex flex-col'>
        <div>
            <h4>{t('external_access.medical_records_request.title')}</h4>
        </div>
        <div className='pt-9'>
            {t('external_access.medical_records_request.subtitle')}
        </div>
        <div className='pt-8 subtitle'>
            {t('external_access.medical_records_request.select_time_header')}
        </div>
        <div className='pt-5'>
            <Radio name='time_selection' value={selectedDateOption.toString()} items={timeOptions}
                   onChange={(value, item) => {
                       setSelectedDateOption(item)
                   }
                   }/>
        </div>
        {
            selectedDateOption === DateOptions.DateRange && <RequestMedicalRecordDateSelection dateSelected={datesSelected}/>
        }
        <div className='pt-9 subtitle'>
            {t('external_access.medical_records_request.select_what_to_do')}
        </div>

        <div className='pt-7 xl:w-1/3'>
            <Tabs>
                <Tab title={t('external_access.medical_records_request.download_tab_header')}>
                    <div className='pt-8'>
                        <div>
                            {t('external_access.medical_records_request.download_info')}
                        </div>
                        <div className='flex flex-row space-x-6 pt-6'>
                            <Button buttonType='secondary-big'
                                    disabled={downloadZipMutation.isLoading}
                                    label='external_access.medical_records_request.preview_button_title'
                                    onClick={previewHtml}/>
                            <Button label='external_access.medical_records_request.download_button_title'
                                    disabled={downloadZipMutation.isLoading}
                                    buttonType='big'
                                    onClick={() => downloadOrShare(true)}/>
                        </div>
                        {downloadZipMutation.isLoading && <ThreeDotsSmallLoader/>}
                    </div>
                </Tab>
                <Tab title={t('external_access.medical_records_request.share_tab_header')}>
                    <div className='pt-8'>
                        <div>
                            {t('external_access.medical_records_request.email_info')}
                        </div>
                        <div className='pt-2 w-3/5'>
                            <form>
                                <ControlledInput
                                    control={control}
                                    name='email'
                                    required={true}
                                    type='email'
                                    defaultValue=''
                                    label='external_access.medical_records_request.email_input_header'
                                />
                                <ControlledInput
                                    control={control}
                                    name='email_confirm'
                                    type='email'
                                    required={true}
                                    errorMessage={email !== emailConfirm ? 'external_access.medical_records_request.confirm_email_error' : ''}
                                    defaultValue=''
                                    label='external_access.medical_records_request.email_confirm_input_header'
                                />
                                <Button
                                    buttonType='big'
                                    onClick={() => downloadOrShare(false)}
                                    disabled={!formState.isDirty || email !== emailConfirm || downloadZipMutation.isLoading}
                                    label={t('external_access.medical_records_request.share_button_title')}
                                    type='submit'/>
                                {downloadZipMutation.isLoading && <ThreeDotsSmallLoader/>}
                            </form>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    </div>
}

export default withErrorLogging(RequestMedicalRecords);
