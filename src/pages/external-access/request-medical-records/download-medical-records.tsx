import ControlledInput from '@components/controllers/ControlledInput';
import Button from '@components/button/button';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {useMutation, useQuery} from 'react-query';
import {downloadMedicalRecords, verifyPatient} from '@pages/patients/services/patients.service';
import {ControlledDateInput} from '@components/controllers';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {AxiosError} from 'axios';
import {
    selectRedirectLink
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';

const DownloadMedicalRecords = () => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const request = useSelector(selectRedirectLink);
    const [isVerified, setIsVerified] = useState<VerifiedPatient | undefined>();
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {handleSubmit, control, formState, watch} =
        useForm({
        mode: 'onBlur'
    });

    const downloadZipMutation = useMutation(downloadMedicalRecords,
        {
            onError: (error: AxiosError) => {
                if (error.response?.status === 404) {
                    setErrorMessage('external_access.medical_records_request.file_not_found');
                } else {
                    setErrorMessage('external_access.medical_records_request.file_download_failed');
                }
            },
            onSuccess: () => {
                setErrorMessage('external_access.medical_records_request.file_downloaded');
            }
        });

    const {isLoading: isVerifyPatientLoading, refetch: verifyPatientRefetch} =
        useQuery([verifyPatient, watch('phoneNumber'), watch('zip'), watch('dob')],() =>
        {
            const date = utils.toShortISOLocalString(watch("dob"));
            return verifyPatient(date, watch('phoneNumber'), watch('zip'));
        },{
            enabled: false,
            onSuccess: (data) => {
                if (request.patientId !== data.patientId.toString()) {
                    setErrorMessage('external_access.download_medical_records.belongs_to_other_patient')
                } else {
                    setIsVerified(data);
                    const {DownloadLink} = request.attributes as any
                    downloadZipMutation.mutate({
                        linkId: DownloadLink
                    })
                }
            },
            onError:(error: AxiosError) => {
                if (error.response?.status === 404) {
                    setErrorMessage('external_access.patient_verification_failed');
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'external_access.patient_verification_failed',
                        position: SnackbarPosition.TopCenter
                    }));
                } else {
                    setErrorMessage('common.error');
                }
            }
        });

    const onSubmit = () => {
        setErrorMessage('');
        verifyPatientRefetch().then()
    }

    return <div className='md:px-48 without-default-padding pt-4 xl:pt-16'>
        <GetExternalUserHeader
            title={`external_access.download_medical_records.title`}
            description='external_access.download_medical_records.verify_desc' />
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='pb-6'>
                       <ControlledDateInput
                                type='date'
                                longDateFormat={false}
                                isCalendarDisabled
                                required={true}
                                errorMessage={formState.errors?.dob && formState.errors?.dob?.type === "required" &&
                                    t('external_access.invalid_dob', {'format' : utils.getBrowserDatePattern()})}
                                label='external_access.download_medical_records.date_of_birth'
                                assistiveText={utils.getBrowserDatePattern()}
                                control={control}
                                name='dob'
                                className='w-full md:w-88'
                                max={new Date(new Date().toDateString())}
                                dataTestId='hipaa-dob'/>
                            <ControlledInput
                                type='tel'
                                defaultValue=''
                                required={true}
                                control={control}
                                className='w-full md:w-88'
                                label={t('external_access.download_medical_records.mobile_phone_number')}
                                name='phoneNumber'/>
                            <ControlledInput
                                type='zip'
                                required={true}
                                errorMessage={formState.errors?.zip && formState.errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                                defaultValue=''
                                className='w-full md:w-88'
                                label={t('external_access.download_medical_records.zip_code')}
                                control={control}
                                name='zip'/>
                    </div>
                    <div className='pb-2 flex justify-start'>
                        <div>
                            <div className='body2-medium pb-4'>
                                <div>{t('external_access.download_medical_records.disclaimer')}</div>
                                <ul className='pl-4 py-2 list-disc'>
                                    <li>{t('external_access.download_medical_records.disclaimer_bullet_1')}</li>
                                    <li>{t('external_access.download_medical_records.disclaimer_bullet_2')}</li>
                                    <li>{t('external_access.download_medical_records.disclaimer_bullet_3')}</li>
                                </ul>
                                <div>{t('external_access.download_medical_records.disclaimer_desc')}</div>
                                {isVerified && <div>{t('external_access.download_medical_records.patient_verified')}</div>}
                            </div>
                            <Button
                                label={'external_access.download_medical_records.download'}
                                disabled={!formState.isDirty || !formState.isValid}
                                className='w-full md:w-auto'
                                type='submit'
                                isLoading={isVerifyPatientLoading || downloadZipMutation.isLoading}
                                data-test-id='submit-button'
                                buttonType='big' />
                        </div>
                    </div>
                </form>
            </div>
        {errorMessage && <div className='text-danger'>{t(errorMessage)}</div>}
    </div>
}

export default DownloadMedicalRecords;
