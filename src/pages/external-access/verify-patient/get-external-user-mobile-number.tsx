import ControlledInput from '@shared/components/controllers/ControlledInput';
import Button from '@components/button/button';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {CheckPatientVerification} from '@constants/react-query-constants';
import {checkPatientVerification} from '@pages/patients/services/patients.service';
import {useHistory} from 'react-router-dom';
import GetExternalUserHeader from '@pages/external-access/verify-patient/get-external-user-header';
import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';
import useFingerPrint from '@shared/hooks/useFingerPrint';
import ExternalUserEmergencyNote from '@pages/external-access/verify-patient/external-user-emergency-note';
import {useDispatch, useSelector} from 'react-redux';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {
    selectRedirectLink,
    selectVerifiedLink
} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {
    setExternalUserEmail,
    setExternalUserPhoneNumber
} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import Spinner from '@components/spinner/Spinner';

const GetExternalUserMobileNumber = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const request = useSelector(selectRedirectLink);
    const verifiedLink = useSelector(selectVerifiedLink);
    const dispatch = useDispatch();
    const [isLoading, setLoading] = useState<boolean>(true);
    const fingerPrintCode = useFingerPrint();
    const {handleSubmit, control, formState, watch} = useForm({
        mode: 'onBlur'
    });

    useEffect(() => {
        if (request.sentAddress ||
            (request.requestType === ExternalAccessRequestTypes.SentTicketMessageViaSMS && !request.patientId)) {
            setExternalUserPhoneNumber(request.sentAddress);
            history.push('/o/verify-patient-code');
        }
        if (verifiedLink && verifiedLink === request.linkId) {
            history.push('/o/verify-patient-code');
        }
        setLoading(false);
    }, [request, verifiedLink]);

    const {isLoading: checkPatientVerificationLoading, error: checkPatientVerificationError, refetch: checkPatientVerificationRefetch} =
        useQuery([CheckPatientVerification, watch('phone')],() => checkPatientVerification({
            fingerprintCode : fingerPrintCode,
            mobilePhoneNumber: watch('phone'),
            verificationChannel: VerificationChannel.Web
        }),
        {
            enabled: false,
            onSuccess: (data) => {
                dispatch(setExternalUserPhoneNumber(watch('phone')));
                if (data.isVerified) {
                    dispatch(setExternalUserEmail(data.email));
                    history.push('/o/verify-patient-code');
                } else {
                    history.push('/o/verify-patient');
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

    if (isLoading) {
        return <Spinner fullScreen={true} />
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
