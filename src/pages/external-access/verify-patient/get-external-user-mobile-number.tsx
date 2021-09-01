import ControlledInput from '@shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {CheckPatientVerification} from '@constants/react-query-constants';
import {checkPatientVerification} from '@pages/patients/services/patients.service';
import {useHistory} from 'react-router-dom';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';
import useFingerPrint from '@shared/hooks/useFingerPrint';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {useDispatch} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';

export interface GetExternalUserMobileNumberProps {
    request: RedirectLink
}

const GetExternalUserMobileNumber = ({request}: GetExternalUserMobileNumberProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const fingerPrintCode = useFingerPrint();
    const {handleSubmit, control, formState, watch} = useForm({
        mode: 'onBlur'
    });

    const {isLoading: checkPatientVerificationLoading, error: checkPatientVerificationError, refetch: checkPatientVerificationRefetch} =
        useQuery([CheckPatientVerification, watch('phone')],() => checkPatientVerification({
            fingerprintCode : fingerPrintCode,
            mobilePhoneNumber: watch('phone'),
            verificationChannel: VerificationChannel.Web
        }),
        {
            enabled: false,
            onSuccess: (data) => {
                if (data.isVerified) {
                    history.push('/o/verify-patient-code', {
                        request,
                        phoneNumber: watch('phone')
                    });
                } else {
                    history.push('/o/verify-patient', {
                        request,
                        phoneNumber: watch('phone')
                    });
                }
            }, onError:() => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message:'common.error'
                }))
            }
        });

    const onSubmit = () => {
        checkPatientVerificationRefetch();
    }

    return <div className='md:px-48 without-default-padding pt-4 xl:pt-16'>
            <GetExternalUserHeader
                title={`external_access.title_${request.requestType}`}
                description='external_access.enter_mobile_number' />
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='pb-6'>
                        <ControlledInput
                            type='tel'
                            defaultValue=''
                            required={true}
                            control={control}
                            className='w-full md:w-88'
                            label={t('external_access.mobile_phone_number')}
                            name='phone'/>
                    </div>
                    <div className='pb-2 flex justify-start'>
                        <div>
                            <Button
                                label={'common.continue'}
                                disabled={!formState.isDirty || !formState.isValid}
                                className='w-full md:w-auto'
                                type='submit'
                                isLoading={checkPatientVerificationLoading}
                                data-test-id='mobile-phone-submit-button'
                                buttonType='big' />
                        </div>
                    </div>
                </form>
            </div>
        {checkPatientVerificationError && <div className='text-danger'>{t('common.error')}</div>}
        <ExternalUserEmergencyNote type={request.requestType}/>
    </div>
}

export default GetExternalUserMobileNumber;
