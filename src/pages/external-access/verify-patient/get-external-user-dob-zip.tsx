import ControlledInput from '@shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {CheckPatientIsExist} from '@constants/react-query-constants';
import {checkIfPatientExists} from '@pages/patients/services/patients.service';
import {useHistory} from 'react-router-dom';
import {ControlledDateInput} from '@components/controllers';
import utils from '@shared/utils/utils';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {AxiosError} from 'axios';
import {
    selectExternalUserPhoneNumber,
    selectRedirectLink
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {setExternalUserEmail} from '@pages/external-access/verify-patient/store/verify-patient.slice';

const GetExternalUserDobZip = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const phoneNumber = useSelector(selectExternalUserPhoneNumber);
    const request = useSelector(selectRedirectLink);
    const [displayNotFoundError, setDisplayNotFoundError] = useState<boolean>(false);
    const [failCount, setFailCount] = useState<number>(0);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const {handleSubmit, control, formState, watch} =
        useForm({
        mode: 'onBlur'
    });

    const {isLoading: checkIfPatientExistsLoading, refetch: checkIfPatientExistsRefetch} =
        useQuery([CheckPatientIsExist, phoneNumber, watch('zip'), watch('dob')],() =>
        {
            const date = utils.toShortISOLocalString(watch("dob"));
            return checkIfPatientExists({
                mobilePhoneNumber: phoneNumber,
                zip: watch('zip'),
                dateOfBirth: date
            });
        },{
            enabled: false,
            onSuccess: (data) => {
                if (!data.doesExists) {
                    setFailCount((failCount) => failCount + 1);
                    setDisplayNotFoundError(true);
                } else {
                    if (data.patientId.toString() === request.patientId) {
                        dispatch(setExternalUserEmail(data.email));
                        history.push('/o/verify-patient-code');
                    } else {
                        dispatch(addSnackbarMessage({
                            type: SnackbarType.Error,
                            message: 'external_access.not_verified_patient',
                            position: SnackbarPosition.TopCenter
                        }));
                    }

                }
            },
            onError:(error: AxiosError) => {
                if (error.response?.status === 404) {
                    setFailCount(failCount => failCount +1);
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
        checkIfPatientExistsRefetch();
    }

    if (failCount > Number(utils.getAppParameter('HipaaVerificationRetryNumber'))) {
        history.push('/o/callback-ticket');
    }

    return <div className='md:px-48 without-default-padding pt-4 xl:pt-16'>
        <GetExternalUserHeader
            title={`external_access.title_${request.requestType}`}
            description={t('external_access.hipaa_verify_description', {day: utils.getAppParameter('VerifiedPatientExpiresInDays')})} />
        {displayNotFoundError && <div className='body2 text-danger pb-6'>
            {t('external_access.mobile_verification_failed', { "phone": utils.getAppParameter('CallUsPhone')})}
        </div>}
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
                                label='external_access.dob'
                                assistiveText={utils.getBrowserDatePattern()}
                                control={control}
                                name='dob'
                                className='w-full md:w-88'
                                max={new Date(new Date().toDateString())}
                                dataTestId='hipaa-dob'/>
                            <ControlledInput
                                type='zip'
                                required={true}
                                errorMessage={formState.errors?.zip && formState.errors?.zip?.type === "required" && t('components.input.invalid_zip')}
                                defaultValue=''
                                className='w-full md:w-88'
                                label={t('external_access.zip_code')}
                                control={control}
                                name='zip'/>
                    </div>
                    <div className='pb-2 flex justify-start'>
                        <div>
                            <Button
                                label={'common.continue'}
                                disabled={!formState.isDirty || !formState.isValid}
                                className='w-full md:w-auto'
                                type='submit'
                                isLoading={checkIfPatientExistsLoading}
                                data-test-id='mobile-phone-submit-button'
                                buttonType='big' />
                        </div>
                    </div>
                </form>
            </div>
        {errorMessage && <div className='text-danger'>{t(errorMessage)}</div>}
        <ExternalUserEmergencyNote type={request.requestType}/>
    </div>
}

export default GetExternalUserDobZip;
