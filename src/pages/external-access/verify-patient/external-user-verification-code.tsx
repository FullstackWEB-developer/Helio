import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import ControlledInput from '../../../shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import {useForm} from 'react-hook-form';
import {useMutation, useQuery} from 'react-query';
import {CheckVerificationCode} from '@constants/react-query-constants';
import {checkVerificationCode, sendVerificationCode} from '@pages/patients/services/patients.service';
import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {TicketSmsPath} from '@app/paths';
import useFingerPrint from '@shared/hooks/useFingerPrint';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {setVerifiedPatient} from '@pages/patients/store/patients.slice';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';
import {setAuthentication} from '@shared/store/app-user/appuser.slice';
import Checkbox from '@components/checkbox/checkbox';
import {ResendTimeout} from '@pages/external-access/verify-patient/resend-timeout';
import {
    selectExternalUserEmail,
    selectExternalUserPhoneNumber,
    selectIsVerified,
    selectRedirectLink
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {setIsVerified} from '@pages/external-access/verify-patient/store/verify-patient.slice';

const ExternalUserVerificationCode = () => {
    const {t} = useTranslation();
    const email = useSelector(selectExternalUserEmail);
    const phoneNumber = useSelector(selectExternalUserPhoneNumber);
    const request = useSelector(selectRedirectLink);
    const history = useHistory();
    const [verificationFailed, setVerificationFailed] = useState<boolean>(false);
    const [sendViaEmail, setSendViaEmail] = useState<boolean>(false);
    const [isResendDisabled, setResendDisabled] = useState<boolean>(false);
    const [emailSentBefore, setEmailSentBefore] = useState<boolean>(false);
    const isVerified = useSelector(selectIsVerified);
    const fingerPrintCode = useFingerPrint();
    const dispatch = useDispatch();
    const {handleSubmit, control, formState: {isValid, isDirty}, watch} =
        useForm({
            mode: 'onBlur'
        });


    const forwardToRelatedPage = () => {
        if (request !== undefined) {
            switch (request.requestType) {
                case ExternalAccessRequestTypes.GetAppointmentDetail:
                case ExternalAccessRequestTypes.CancelAppointment:
                case ExternalAccessRequestTypes.BookAppointment:
                    history.push('/o/appointment-list');
                    break;
                case ExternalAccessRequestTypes.RequestRefill:
                    history.push('/o/view-medications');
                    break;
                case ExternalAccessRequestTypes.RescheduleAppointment:
                    history.push('/o/appointment-list');
                    break;
                case ExternalAccessRequestTypes.RequestMedicalRecords:
                    history.push('/o/request-medical-records');
                    break;
                case ExternalAccessRequestTypes.GetLabResults:
                    history.push('/o/lab-results');
                    break;
                case ExternalAccessRequestTypes.ScheduleAppointment:
                    history.push('/o/appointment-schedule');
                    break;
                case ExternalAccessRequestTypes.SentTicketMessageViaSMS:
                    history.push(TicketSmsPath);
                    break;
            }
        }
    }

    useEffect(() => {
        if (isVerified || request.requestType === ExternalAccessRequestTypes.SentTicketMessageViaSMS && !request.patientId) {
            forwardToRelatedPage();
        } else {
            sendVerification(VerificationType.Sms);
        }
    }, []);

    const sendVerificationCodeMutation = useMutation(sendVerificationCode, {
        onError: () => {
            dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'common.error',
                position: SnackbarPosition.TopCenter
            }));
        }
    });


    const {isLoading, isError, refetch: checkVerificationRefetch} =
        useQuery([CheckVerificationCode, phoneNumber, watch('code'), request.patientId], () => checkVerificationCode({
                verificationCode: watch('code'),
                verificationChannel: VerificationChannel.Web,
                patientId: parseInt(request.patientId),
                fingerPrintCode: fingerPrintCode
            }),
            {
                enabled: false,
                onSuccess: (data) => {
                    if (data.isVerified) {
                        dispatch(setIsVerified(true));
                        dispatch(setAuthentication({
                            name: `${data.verifiedPatient.firstName} ${data.verifiedPatient.lastName}`,
                            isLoggedIn: true,
                            accessToken: data.authenticationResponse.token,
                            expiresOn: data.authenticationResponse.expiresAt,
                            authenticationLink: request.fullUrl
                        }));
                        dispatch(setVerifiedPatient(data.verifiedPatient));
                        forwardToRelatedPage();
                    } else {
                        setVerificationFailed(true);
                        setResendDisabled(false);
                        dispatch(addSnackbarMessage({
                            message: 'external_access.verification_failed',
                            type: SnackbarType.Error,
                            position: SnackbarPosition.TopCenter
                        }));
                    }
                }
            });

    const sendVerification = (type: VerificationType) => {
        sendVerificationCodeMutation.mutate({
            verificationType: type,
            verificationChannel: VerificationChannel.Web,
            patientId: Number(request.patientId),
            mobilePhoneNumber: phoneNumber
        }, {
            onSuccess: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: sendViaEmail ? 'external_access.six_digit_code_resent_to_email' : 'external_access.six_digit_code_resent_to_mobile',
                    position: SnackbarPosition.TopCenter
                }));
                setResendDisabled(true);
            }
        });
    }

    const resendVerification = (type: VerificationType) => {
        if (isVerified) {
            return;
        }
        sendVerification(type);
    }

    const triggerEmailSend = (isChecked: boolean) => {
        setSendViaEmail(isChecked);
        if (isChecked && !emailSentBefore) {
            setResendDisabled(false);
            setEmailSentBefore(true);
            resendVerification(VerificationType.Email);
        } else {
            setResendDisabled(true);
        }
    }

    const onSubmit = () => {
        setVerificationFailed(false);
        checkVerificationRefetch();
    }

    const isButtonDisabled = () => {
        return !isDirty || !isValid || watch('code') && watch('code').length !== 6;
    };

    const headerDescription = () => {
        if (sendViaEmail) {
            return t('external_access.verification_code_sent_description_email', {
                'email': email
            });
        } else {
            return t('external_access.verification_code_sent_description', {
                'phone': utils.maskPhone(phoneNumber)
            });
        }
    }

    return <div className='md:px-48'>
        <GetExternalUserHeader
            title={`external_access.title_${request.requestType}`}
            description={headerDescription()}/>

        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className='pb-6'>
                    <ControlledInput
                        type='number'
                        required={true}
                        maxLength={6}
                        max={999999}
                        defaultValue=''
                        className='w-full md:w-88'
                        label={t('external_access.six_digit_code')}
                        control={control}
                        name='code'/>
                </div>
                <div className='pt-2 flex flex-col md:flex-row pb-10 space-y-3 md:space-y-0'>
                    <div className='body2'>{t('external_access.resend_verification_message')}</div>
                    <div className='body2'>
                        <a className={(isResendDisabled || sendVerificationCodeMutation.isLoading) ? 'disabled xl:px-2' : 'xl:px-2'}
                           onClick={() => resendVerification(sendViaEmail ? VerificationType.Email : VerificationType.Sms)}>
                            {t('external_access.resend_verification_cta')}
                        </a>
                    </div>
                    {isResendDisabled && <ResendTimeout message='external_access.resend_in_seconds'
                                                        countdownSeconds={isResendDisabled ? 60 : 0}
                                                        onTimeOut={() => setResendDisabled(false)}/>}
                </div>
                {!!email && <div className='pb-10'>
                    <Checkbox labelClassName='w-96' value='sendViaEmail'
                              onChange={(checked) => triggerEmailSend(checked.checked)}
                              name='sendViaEmail' label='external_access.send_via_email'/>
                </div>}
                <div className='pb-2 flex justify-start'>
                    <div>
                        <Button
                            label={'common.continue'}
                            disabled={isButtonDisabled()}
                            className='w-full md:w-auto'
                            type='submit'
                            isLoading={isLoading || sendVerificationCodeMutation.isLoading}
                            data-test-id='mobile-phone-submit-button'
                            buttonType='big'/>
                    </div>
                </div>
            </form>
            {verificationFailed && <div className='text-danger'>{t('external_access.verification_failed')}</div>}
            {isError && <div className='text-danger'>{t('common.error')}</div>}
            <ExternalUserEmergencyNote type={request.requestType}/>
        </div>
    </div>
}

export default ExternalUserVerificationCode;
