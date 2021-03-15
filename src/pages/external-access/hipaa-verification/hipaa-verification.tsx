import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { selectRedirectLink } from './store/redirect-link.selectors';
import { verifyPatient } from '../../../shared/services/search.service';
import Input from '../../../shared/components/input/input';
import { setError } from '../../../shared/components/search-bar/store/search-bar.slice';
import {
    clearAppointments, clearVerifiedPatient,
    setPatientIsVerified,
    setVerifiedPatient
} from '../../patients/store/patients.slice';
import Logger from '../../../shared/services/logger';
import { VerifiedPatient } from '../../patients/models/verified-patient';
import { selectIsPatientVerified } from '../../patients/store/patients.selectors';
import ThreeDots from '../../../shared/components/skeleton-loader/skeleton-loader';
import { clearRescheduleAppointmentState } from '../reschedule-appointment/store/reschedule-appointment.slice';
import { clearRequestRefillState } from '../request-refill/store/request-refill.slice';
import Button from '../../../shared/components/button/button';

enum RequestTypes {
    GetAppointmentDetail = 1,
    RescheduleAppointment,
    GetLabResults,
    RequestRefill,
    RequestMedicalRecords
}

const HipaaVerification = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const logger = Logger.getInstance();
    const redirectLink = useSelector(selectRedirectLink)
    const isVerified = useSelector(selectIsPatientVerified);
    const [isVerificationCompleted, setVerificationCompleted] = useState(false);
    const [isVerifyingPatient, setIsVerifyingPatient] = useState(false);
    const [formData, setFormData] = useState({
        dob: '',
        phone: '',
        zip: ''
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    useEffect(() => {
        dispatch(clearAppointments());
        dispatch(clearRescheduleAppointmentState());
        dispatch(clearRequestRefillState());
        dispatch(clearVerifiedPatient());
    }, [dispatch]);


    const handleSubmit = async (event: { preventDefault: () => void; }) => {
        event.preventDefault();
        dispatch(setError(false));
        setIsVerifyingPatient(true);
        try {
            const verifiedPatient = await verifyPatient(formData.dob, formData.phone, formData.zip);
            if (verifiedPatient.patientId.toString() === redirectLink.patientId) {
                dispatch(setVerifiedPatient(verifiedPatient as VerifiedPatient));
                forwardToRelatedPage();
            } else {
                dispatch(setPatientIsVerified(false));
            }
        } catch (error) {
            switch (error.response?.status) {
                case 404:
                    dispatch(setPatientIsVerified(false));
                    break;
                default:
                    logger.error('Failed verifying for patient', error);
                    dispatch(setError(true));
                    dispatch(setPatientIsVerified(false));
                    break;
            }
        } finally {
            setVerificationCompleted(true);
            setIsVerifyingPatient(false);
        }

    }

    const forwardToRelatedPage = () => {
        if (redirectLink !== undefined) {
            switch (redirectLink.requestType) {
                case RequestTypes.GetAppointmentDetail:
                    history.push('/appointment-detail');
                    break;
                case RequestTypes.RequestRefill:
                    history.push('/request-refill');
                    break;
                case RequestTypes.RescheduleAppointment:
                    history.push('/reschedule-appointment');
                    break;
                case RequestTypes.RequestMedicalRecords:
                    history.push('/request-medical-records');
                    break;
                case RequestTypes.GetLabResults:
                    history.push('/lab-results');
                    break;
            }
        }
    }

    if (isVerifyingPatient) {
        return <ThreeDots />
    }
    if (isVerificationCompleted && !isVerified) {
        return <div>{t('hipaa_validation_form.hipaa_verification_failed')}</div>
    }

    return (
        <div className='container mx-auto my-auto'>
            <div className='mt-10 sm:mt-0'>
                <div className='md:grid md:grid-cols-3 md:gap-6'>
                    <div className='md:col-span-1'>
                        <div className='px-4 sm:px-0'>
                            <h3 className='text-lg font-medium leading-6 text-gray-900'>{t('hipaa_validation_form.hipaa_verification')}</h3>
                            <p className='mt-1 text-sm text-gray-600'>
                                {t('hipaa_validation_form.ask_additional_information')}
                            </p>
                        </div>
                    </div>
                    <div className='mt-5 md:mt-0 md:col-span-2'>
                        <form data-test-id='hipaa-validation-form-additional-information-form' onSubmit={handleSubmit} autoComplete='off' >
                            <div className='shadow overflow-hidden sm:rounded-md'>
                                <div className='px-4 py-5 bg-white sm:p-6'>
                                    <div className='grid grid-cols-6 gap-6'>
                                        <div className='col-span-6 sm:col-span-3'>
                                            <Input data-test-id='hipaa-validation-form-dob' type='date' name='dob' id='dob' htmlFor='dob'
                                                label={'hipaa_validation_form.dob'}
                                                value={formData.dob}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='col-span-6 sm:col-span-4'>
                                            <Input data-test-id='hipaa-validation-form-phone' type='text' name='phone' id='phone' htmlFor='phone'
                                                label={'hipaa_validation_form.phone'}
                                                value={formData.phone}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className='col-span-6'>
                                            <Input data-test-id='hipaa-validation-form-zip' type='text' name='zip' id='zip' htmlFor='zip'
                                                label={'hipaa_validation_form.zip'}
                                                value={formData.zip}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                </div>
                                <div className='px-4 py-3 bg-gray-50 text-right sm:px-6'>
                                    <Button type='submit' data-test-id='hipaa-validation-form-verify-btn' label={'hipaa_validation_form.verify'} disabled={!formData.dob || !formData.phone || !formData.zip} />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HipaaVerification;

