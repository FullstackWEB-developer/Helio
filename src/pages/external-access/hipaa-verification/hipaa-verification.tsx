import {useTranslation} from 'react-i18next';
import {RedirectLink} from '@pages/external-access/hipaa-verification/models/redirect-link';
import {useForm} from 'react-hook-form';
import React, {useEffect, useState} from 'react';
import ControlledInput from '@components/controllers/ControllerInput';
import ControlledDateInput from '@components/controllers/ControlledDateInput';
import Button from '@components/button/button';
import {verifyPatient, VerifyPatientProps} from '@shared/services/search.service';
import {useQuery} from 'react-query';
import {VerifyPatient} from '@constants/react-query-constants';
import {AxiosError} from 'axios';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import {clearVerifiedPatient, setVerifiedPatient} from '@pages/patients/store/patients.slice';
import {useHistory} from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {ExternalAccessRequestTypes} from '../models/external-updates-request-types.enum';
import './hipaa-verification.scss';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';
import utils from '@shared/utils/utils';
import {setAuthentication} from "@shared/store/app-user/appuser.slice";
import {authenticationSelector} from "@shared/store/app-user/appuser.selectors";

export interface HipaaVerificationProps {
    request: RedirectLink
}

const HipaaVerification = ({request}: HipaaVerificationProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    const authentication = useSelector(authenticationSelector);
    const [values, setValues] = useState<VerifyPatientProps>();
    const [errors, setErrors] = useState<string>('');
    const {handleSubmit, control, formState} = useForm({
        mode: 'onBlur'
    });

    const checkAuthenticationState = () => {
       if (authentication && (Date.parse(authentication.expiresOn) > new Date().valueOf())) {
           forwardToRelatedPage();
       }
    }

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
                    history.push('/o/request-medical-records', {
                        request: request
                    });
                    break;
                case ExternalAccessRequestTypes.GetLabResults:
                    history.push('/o/lab-results');
                    break;
            }
        }
    }

    const {isLoading, refetch} = useQuery<VerifiedPatient, AxiosError>([VerifyPatient, values], () =>
        verifyPatient(values!), {
        enabled: false,
        onSuccess: (data) => {
            if (data.patientId.toString() === request.patientId) {
                dispatch(setVerifiedPatient(data));
                dispatch(setAuthentication({
                    name: `${data.firstName} ${data.lastName}`,
                    isLoggedIn: true,
                    accessToken: data.token,
                    expiresOn: data.tokenExpiration,
                    authenticationLink: request.fullUrl
                }));
                forwardToRelatedPage();
            } else {
                setErrors('external_access.hipaa.verification_failed');
            }
        },
        onError: (err) => {
            if (err.response?.status === 404) {
                setErrors('external_access.hipaa.verification_failed');
            } else {
                return setErrors('common.error');
            }
        }
    }
    );

    const onSubmit = async (values: VerifyPatientProps) => {
        setValues(values);
    }

    useEffect(() => {
        checkAuthenticationState()
    }, [checkAuthenticationState]);

    useEffect(() => {
        if (values) {
            refetch();
        }
    }, [values, refetch]);

    useEffect(() => {

    }, [formState]);

    useEffect(() => {
        dispatch(clearVerifiedPatient());
        setErrors('');
    }, [dispatch]);

    return <>
        <div className='md:px-48'>
            <div className='md:whitespace-pre md:h-24 my-3 md:pb-10 w-full items-center'>
                <h4>
                    {t(`external_access.title_${request.requestType}`)}
                </h4>
            </div>
            <div className='py-6 md:py-10'>
                {t('external_access.hipaa.verify_title')}
            </div>
            <form onSubmit={handleSubmit(onSubmit)} onChange={() => setErrors('')}>
                <div className='hipaa-verification-form'>
                    <div className='pb-6'>
                        <ControlledDateInput
                            type='date'
                            longDateFormat={false}
                            isCalendarDisabled
                            required={true}
                            label='external_access.hipaa.dob'
                            assistiveText={utils.getBrowserDatePattern()}
                            control={control}
                            name='dob'
                            max={new Date(new Date().toDateString())}
                            dataTestId='hipaa-dob' />
                    </div>
                    <div className='pb-6'>
                        <ControlledInput
                            type='tel'
                            defaultValue=''
                            required={true}
                            className='w-full md:w-auto'
                            label={t('external_access.hipaa.mobile_phone_number')}
                            control={control}
                            name='phone'
                            dataTestId='hipaa-phone' />
                    </div>
                    <div className='pb-6'>
                        <ControlledInput
                            type='zip'
                            required={true}
                            defaultValue=''
                            className='w-full md:w-auto'
                            label={t('external_access.hipaa.zip_code')}
                            control={control}
                            name='zip'
                            dataTestId='hipaa-zip' />
                    </div>
                    <div className='py-6 flex md:justify-start justify-center'>
                        <div>
                            <Button
                                label={'common.continue'}
                                disabled={!formState.isDirty || !formState.isValid || isLoading}
                                className='w-full md:w-auto'
                                type='submit'
                                data-test-id='hipaa-submit-button'
                                buttonType='big' />
                        </div>
                    </div>
                    {isLoading && <ThreeDotsSmallLoader className="three-dots-loader-small" cx={13} cxSpace={23} cy={16} height={30} />}
                    <div className='text-danger'>
                        {t(errors)}
                    </div>
                </div>
            </form>
        </div>
    </>
}

export default HipaaVerification;
