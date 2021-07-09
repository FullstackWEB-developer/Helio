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
import {
    checkMedicalRecordJobStatus, downloadMedicalRecords,
    DownloadMedicalRecordsProps,
    prepareAndDownloadMedicalRecords
} from '@pages/patients/services/patients.service';
import {useLocation} from 'react-router-dom';
import {useMutation, useQuery} from 'react-query';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import {setMedicalRecordsPreviewData} from '@pages/external-access/request-medical-records/store/medical-records.slice';
import dayjs from 'dayjs';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-position.enum';
import {AsyncJobInfo} from '@pages/patients/models/async-job-info.model';
import {AsyncJobStatus} from '@pages/patients/models/async-job-status.enum';
import {CheckMedicalRecordStatus} from '@constants/react-query-constants';

const RequestMedicalRecords = () => {
    enum DateOptions {
        AllTime = 1,
        DateRange
    }

    enum RequestType {
        Download = 1,
        Share,
        Preview
    }

    const patient = useSelector(selectVerifiedPatent);
    const [selectedDateOption, setSelectedDateOption] = useState<DateOptions>(DateOptions.AllTime);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs().add(-1, 'month').toDate());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const [requestType, setRequestType] = useState<RequestType>();
    const [request, setRequest] = useState<DownloadMedicalRecordsProps>();
    const [jobInformation, setJobInformation] = useState<AsyncJobInfo>();
    const [isLoading, setLoading] = useState<boolean>(false);
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

    const shouldCheckStatus= () => {
        return jobInformation !== undefined &&
        (jobInformation.status.toString() === AsyncJobStatus[AsyncJobStatus.New]||
            jobInformation.status.toString() === AsyncJobStatus[AsyncJobStatus.InProgress]);
    }

    useQuery([CheckMedicalRecordStatus, jobInformation?.id], async () =>
            checkMedicalRecordJobStatus(jobInformation?.id!),
        {
            enabled: shouldCheckStatus(),
            refetchInterval: (jobInformation?.status === AsyncJobStatus.Error || jobInformation?.status === AsyncJobStatus.Completed) ? false : 5000,
            refetchIntervalInBackground: true,
            refetchOnWindowFocus: false,
            onSuccess: (data) => {
                setJobInformation(data);
                if (data.status.toString() === AsyncJobStatus[AsyncJobStatus.Completed]) {
                    switch (requestType) {
                        case RequestType.Download:
                            downloadMedicalRecordsMutation.mutate({linkId: location.state.request.linkId});
                            break;
                        case RequestType.Share:
                            displaySuccessSnackbars();
                            break;
                        case RequestType.Preview:
                            if (request) {
                                dispatch(setMedicalRecordsPreviewData(request));
                                window.open('/medical-records-preview', '_blank');
                            }
                            setLoading(false);
                            break;
                    }
                }
            },
            onError: () => {
                displayErrorSnackbars();
            }
        }
    )

    const startPreparationMutation = useMutation(prepareAndDownloadMedicalRecords);
    const downloadMedicalRecordsMutation = useMutation(downloadMedicalRecords,
        {
            onSettled: () => {
            }, onError: () => {
                displayErrorSnackbars();
            }, onSuccess: () => {
                displaySuccessSnackbars();
            }
        });

    const startRequest = (type : RequestType) => {
        setLoading(true);
        setRequestType(type);
        let request: DownloadMedicalRecordsProps = {
            patientId: patient.patientId,
            departmentId: patient.departmentId,
            downloadLink: location.state.request.linkId,
            isDownload: type === RequestType.Download,
            emailAddress: getValues('email'),
            asHtml: type === RequestType.Preview
        };
        setRequest(request);
        dispatch(setMedicalRecordsPreviewData(request));
        if (selectedDateOption === DateOptions.DateRange) {
            request = {
                ...request,
                startDate: selectedStartDate,
                endDate: selectedEndDate,
            }
        }
        startPreparationMutation.mutate(request,
            {
                onSuccess: (data) => {
                    setJobInformation(data);
                },
                onError: () => {
                    displayErrorSnackbars();
                }
            });
    }

    const displayErrorSnackbars = () => {
        setLoading(false);
        if (requestType === RequestType.Download) {
            dispatch(addSnackbarMessage({
                message: 'external_access.medical_records_request.file_download_failed',
                type: SnackbarType.Error
            }));
        }
        if (requestType === RequestType.Share) {
            dispatch(addSnackbarMessage({
                message: 'external_access.medical_records_request.email_sent_failed',
                type: SnackbarType.Error
            }));
        }
    }

    const displaySuccessSnackbars = () => {
        setLoading(false);
        if (requestType === RequestType.Download) {
            dispatch(addSnackbarMessage({
                message: 'external_access.medical_records_request.file_downloaded',
                type: SnackbarType.Success
            }));
        }
        if (requestType === RequestType.Share) {
            dispatch(addSnackbarMessage({
                message: 'external_access.medical_records_request.email_sent_successfully',
                type: SnackbarType.Success
            }));
        }
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

        <div className='pt-7 xl:w-2/5'>
            <Tabs>
                <Tab title={t('external_access.medical_records_request.download_tab_header')}>
                    <div className='pt-8'>
                        <div className='body2'>
                            {t('external_access.medical_records_request.download_info')}
                        </div>
                        <div className='flex flex-row space-x-6 pt-6'>
                            <Button buttonType='secondary-big'
                                    disabled={isLoading}
                                    isLoading={isLoading && requestType === RequestType.Preview}
                                    label='external_access.medical_records_request.preview_button_title'
                                    onClick={() => startRequest(RequestType.Preview)}/>
                            <Button label='external_access.medical_records_request.download_button_title'
                                    disabled={isLoading}
                                    isLoading={isLoading && requestType === RequestType.Download}
                                    buttonType='big'
                                    onClick={() => startRequest(RequestType.Download)}/>
                        </div>
                    </div>
                </Tab>
                <Tab title={t('external_access.medical_records_request.share_tab_header')}>
                    <div className='pt-8'>
                        <div className='body2'>
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
                                    errorMessage={(email !== emailConfirm && emailConfirm) ? 'external_access.medical_records_request.confirm_email_error' : ''}
                                    defaultValue=''
                                    label='external_access.medical_records_request.email_confirm_input_header'
                                />
                                <Button
                                    className='mt-1'
                                    buttonType='big'
                                    onClick={() => startRequest(RequestType.Share)}
                                    isLoading={isLoading && requestType === RequestType.Share}
                                    disabled={!formState.isDirty || email !== emailConfirm || isLoading}
                                    label={t('external_access.medical_records_request.share_button_title')}
                                    type='submit'/>
                            </form>
                        </div>
                    </div>
                </Tab>
            </Tabs>
        </div>
    </div>
}

export default withErrorLogging(RequestMedicalRecords);
