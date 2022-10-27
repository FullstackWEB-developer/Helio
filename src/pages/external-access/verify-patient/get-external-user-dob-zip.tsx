import ControlledInput from '@shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { useQuery } from 'react-query';
import { CheckPatientIsExist } from '@constants/react-query-constants';
import { checkIfPatientExists } from '@pages/patients/services/patients.service';
import { useHistory } from 'react-router-dom';
import utils from '@shared/utils/utils';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import { useDispatch, useSelector } from 'react-redux';
import { addSnackbarMessage } from '@shared/store/snackbar/snackbar.slice';
import { SnackbarType } from '@components/snackbar/snackbar-type.enum';
import { SnackbarPosition } from '@components/snackbar/snackbar-position.enum';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import { AxiosError } from 'axios';
import {
    selectExternalUserPhoneNumber,
    selectRedirectLink
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {setExternalUserEmail, setRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {INPUT_DATE_FORMAT} from '@constants/form-constants';

const GetExternalUserDobZip = () => {
    const { t } = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const phoneNumber = useSelector(selectExternalUserPhoneNumber);
    const request = useSelector(selectRedirectLink);
    const [displayNotFoundError, setDisplayNotFoundError] = useState<boolean>(false);
    const [failCount, setFailCount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const { handleSubmit, control, formState, watch } =
        useForm({
            mode: 'onBlur'
        });

    const { isLoading: checkIfPatientExistsLoading, refetch: checkIfPatientExistsRefetch } =
        useQuery([CheckPatientIsExist, phoneNumber, watch('zip'), watch('dob')], () => {
            const date = utils.toShortISOLocalString(watch("dob"));
            return checkIfPatientExists({
                mobilePhoneNumber: phoneNumber,
                zip: watch('zip'),
                dateOfBirth: date
            });
        }, {
            enabled: false,
            onSuccess: (data) => {
                if (!data.doesExists) {
                    setFailCount((failCount) => failCount + 1);
                    setDisplayNotFoundError(true);
                } else {
                    if (!request.patientId) {
                        dispatch(setRedirectLink({
                            ...request,
                            patientId:data.patientId.toString()
                        }));
                    }
                    if (!request.patientId || data.patientId.toString() === request.patientId) {
                        dispatch(setExternalUserEmail(data.email));
                        history.push('/o/verify-patient-select-channel', {
                            email: data.email,
                            mobileNumber: data.mobileNumber
                        });
                    } else if (!!request.patientId) {
                        dispatch(addSnackbarMessage({
                            type: SnackbarType.Error,
                            message: 'external_access.not_verified_patient',
                            position: SnackbarPosition.TopCenter
                        }));
                    }

                }
            },
            onError: (error: AxiosError) => {
                if (error.response?.status === 404) {
                    setFailCount(failCount => failCount + 1);
                    setErrorMessage('external_access.patient_verification_failed');
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: 'external_access.patient_verification_failed',
                        position: SnackbarPosition.TopCenter
                    }));
                } else if (error.response?.status === 409) {
                    setErrorMessage('external_access.patient_data_not_valid');
                } else {
                    setErrorMessage('common.error');
                }
            }
        });

    const onSubmit = () => {
        setErrorMessage('');
        checkIfPatientExistsRefetch();
    }

    if (failCount > Number(utils.getAppParameter('HipaaVerificationRetryNumber'))) {
        history.push('/o/callback-ticket');
    }
    return <div className='pt-4 md:px-12 xl:px-48 without-default-padding xl:pt-16'>
        <GetExternalUserHeader
            title={`external_access.title_${request.requestType}`}
            description={t('external_access.hipaa_verify_description', { day: utils.getAppParameter('VerifiedPatientExpiresInDays') })} />
        {displayNotFoundError && <div className='pb-6 body2 text-danger'>
            {t('external_access.mobile_verification_failed')}
        </div>}
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='pb-6'>
                    <ControlledInput
                        type='date'
                        required={true}
                        errorMessage={formState.errors?.dob && formState.errors?.dob?.type === "required" &&
                            t('external_access.invalid_dob', {'format': INPUT_DATE_FORMAT })}
                        invalidErrorMessage={t('external_access.invalid_dob', {'format': INPUT_DATE_FORMAT })}
                        label='external_access.dob'
                        assistiveText={INPUT_DATE_FORMAT}
                        control={control}
                        name='dob'
                        className='w-full md:w-88'
                        data-testid='hipaa-dob' />
                    <ControlledInput
                        type='zip'
                        required={true}
                        errorMessage={formState.errors?.zip && formState.errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                        defaultValue=''
                        className='w-full md:w-88'
                        label={t('external_access.zip_code')}
                        control={control}
                        name='zip'
                        data-testid='zip' />
                </div>
                <div className='flex justify-start pb-2'>
                    <div>
                        <Button
                            label={'common.continue'}
                            disabled={!formState.isDirty || !formState.isValid}
                            className='w-full md:w-auto'
                            type='submit'
                            isLoading={checkIfPatientExistsLoading}
                            data-test-id='mobile-phone-submit-button'
                            data-testid='mobile-phone-submit-button'
                            buttonType='big' />
                    </div>
                </div>
            </form>
        </div>
        {errorMessage && <div className='text-danger'>{t(errorMessage)}</div>}
        <ExternalUserEmergencyNote type={request.requestType} />
    </div>
}

export default GetExternalUserDobZip;
