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
import ControlledInput from '@components/controllers/ControlledInput';
import {Controller, useForm} from 'react-hook-form';
import {
    checkMedicalRecordJobStatus, downloadMedicalRecords,
    DownloadMedicalRecordsProps,
    prepareAndDownloadMedicalRecords
} from '@pages/patients/services/patients.service';
import {useMutation, useQuery} from 'react-query';
import {setMedicalRecordsPreviewData} from '@pages/external-access/request-medical-records/store/medical-records.slice';
import dayjs from 'dayjs';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {AsyncJobInfo} from '@pages/patients/models/async-job-info.model';
import {AsyncJobStatus} from '@pages/patients/models/async-job-status.enum';
import {CheckMedicalRecordStatus} from '@constants/react-query-constants';
import TextArea from '@components/textarea/textarea';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import Confirmation from '@components/confirmation/confirmation';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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

    dayjs.extend(customParseFormat);
    const patient = useSelector(selectVerifiedPatent);
    const [selectedDateOption, setSelectedDateOption] = useState<DateOptions>(DateOptions.AllTime);
    const [selectedStartDate, setSelectedStartDate] = useState<Date>(dayjs().add(-1, 'month').toDate());
    const [selectedEndDate, setSelectedEndDate] = useState<Date>(new Date());
    const [requestType, setRequestType] = useState<RequestType>();
    const [request, setRequest] = useState<DownloadMedicalRecordsProps>();
    const [jobInformation, setJobInformation] = useState<AsyncJobInfo>();
    const [isLoading, setLoading] = useState<boolean>(false);
    const [downloadRequestId, setDownloadRequestId] = useState<string>('');
    const [displayConfirmation, setDisplayConfirmation] = useState<boolean>(false);
    const verifyLink = useSelector(selectRedirectLink);
    const dispatch = useDispatch();
    const {control, formState, getValues, watch} = useForm({
        mode: 'onBlur'
    });
    const {isDirty, isValid} = formState;
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
                            downloadMedicalRecordsMutation.mutate({linkId: downloadRequestId});
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

    const startRequest = (e: React.MouseEvent<HTMLButtonElement>, type : RequestType) => {
        e.preventDefault();
        setLoading(true);
        setRequestType(type);
        const requestId = !!verifyLink.redirectAfterVerification ? dayjs().format('YYYYMMDD-HHmmss') :  verifyLink.linkId;
        setDownloadRequestId(requestId);
        let request: DownloadMedicalRecordsProps = {
            patientId: patient.patientId,
            departmentId: patient.departmentId,
            downloadLink: requestId,
            isDownload: type === RequestType.Download,
            emailAddress: getValues('email'),
            note: getValues('note')?.replaceAll('\n','<br/>'),
            asHtml: type === RequestType.Preview,
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
            setDisplayConfirmation(true);
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
                            {t('external_access.medical_records_request.download_disclaimer')}
                        </div>
                        <div className='body2 pt-4'>
                            {t('external_access.medical_records_request.download_warning')}
                        </div>
                        <div className='body2 py-4'>
                            {t('external_access.medical_records_request.download_info')}
                        </div>
                        <div className='flex flex-row pt-6 space-x-6'>
                            <Button buttonType='secondary-big'
                                    disabled={isLoading}
                                    isLoading={isLoading && requestType === RequestType.Preview}
                                    label='external_access.medical_records_request.preview_button_title'
                                    onClick={(e) => startRequest(e, RequestType.Preview)}/>
                            <Button label='external_access.medical_records_request.download_button_title'
                                    disabled={isLoading}
                                    isLoading={isLoading && requestType === RequestType.Download}
                                    buttonType='big'
                                    onClick={(e) => startRequest(e, RequestType.Download)}/>
                        </div>
                    </div>
                </Tab>
                <Tab title={t('external_access.medical_records_request.share_tab_header')}>
                    <div className='pt-8'>
                        <div className='body2'>
                            {t('external_access.medical_records_request.email_info')}
                        </div>
                            <form>
                                <div className='pt-2 md:w-3/5'>
                                <ControlledInput
                                    control={control}
                                    name='email'
                                    required={true}
                                    shouldDisplayAutocomplete={false}
                                    type='email'
                                    defaultValue=''
                                    label='external_access.medical_records_request.email_input_header'
                                />
                                <ControlledInput
                                    control={control}
                                    shouldDisplayAutocomplete={false}
                                    name='email_confirm'
                                    type='email'
                                    required={true}
                                    errorMessage={(email !== emailConfirm && emailConfirm) ? 'external_access.medical_records_request.confirm_email_error' : ''}
                                    defaultValue=''
                                    label='external_access.medical_records_request.email_confirm_input_header'
                                />
                                </div>
                                <Controller
                                    name='note'
                                    control={control}
                                    defaultValue={''}
                                    render={(controllerProps) => (
                                        <TextArea
                                            {...controllerProps}
                                            placeHolder='external_access.medical_records_request.note'
                                            className='w-full h-full pb-0 pr-0 body2'
                                            data-test-id='medical-records-notes'
                                            rows={3}
                                            maxRows={5}
                                            resizable={false}
                                            hasBorder={true}
                                        />
                                    )}
                                />
                                <div className='body2 py-4'>
                                    {t('external_access.medical_records_request.email_disclaimer')}
                                </div>
                                <div className='pt-2 md:w-3/5'>
                                <Button
                                    className='mt-6'
                                    buttonType='big'
                                    onClick={(e) => startRequest(e, RequestType.Share)}
                                    isLoading={isLoading && requestType === RequestType.Share}
                                    disabled={!isDirty || email !== emailConfirm || isLoading || !isValid}
                                    label={t('external_access.medical_records_request.share_button_title')}
                                    type='submit'/>

                                </div>
                            </form>
                    </div>
                </Tab>
            </Tabs>
        </div>
        <Confirmation title='external_access.medical_records_request.close_window_title'
                      onOk={() => setDisplayConfirmation(false)}
                      onClose={() => setDisplayConfirmation(false)}
                      isOpen={displayConfirmation}
                      displayCancel={false}
                      message='external_access.medical_records_request.close_window_description'
        />
    </div>
}

export default withErrorLogging(RequestMedicalRecords);
