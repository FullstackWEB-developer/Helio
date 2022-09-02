import utils from '@shared/utils/utils';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import {
    selectRegisteredPatient, selectRegisteredPatientInsurance
} from '@pages/external-access/registration/store/registration.selectors';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {RequestChannel} from '@pages/external-access/verify-patient/models/request-channel.enum';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {setRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';
import {useHistory} from 'react-router';
import {INSURANCE_PLAN} from '@pages/external-access/registration/components/registration-insurance-information';
import Button from '@components/button/button';
import {useMutation} from 'react-query';
import {upsertPatient} from '@pages/patients/services/patients.service';
import { SnackbarPosition } from '@components/snackbar/snackbar-position.enum';
export interface RegistrationReviewStepProps {
    goBack: () => void;
}
const RegistrationReviewStep = ({goBack}: RegistrationReviewStepProps) => {
    const patientData = useSelector(selectRegisteredPatient);
    const updatePatientMutation = useMutation(upsertPatient);
    const insuranceData = useSelector(selectRegisteredPatientInsurance);
    const {t} = useTranslation();
    const toastMessageDuration = 12;
    const dispatch = useDispatch();
    const history = useHistory();
    const [successfullyCompletedRegistration, setSuccessfullyCompletedRegistration] = useState(false);
    const displayAddressField = () => {
        const city = patientData?.patient?.city;
        const address = patientData?.patient?.address;
        const zip = patientData?.patient?.zip;
        const apt = patientData?.patient?.address2;
        let addressField = `${address}, ${city}, ${zip}`;
        if (apt) {
            addressField = `${addressField}, ${t(apt.includes('#') ? 'patient.summary.apt_number_no_#' : 'patient.summary.apt_number')}${apt}`;
        }
        return addressField;
    }

    const displayConsents = (method: 'call' | 'text') => {
        const consent = method === 'call' ? patientData?.patient?.consentToCall : patientData?.patient?.consentToText;
        return consent ? t('common.yes') : t('common.no');
    }

    const displayPreferredCommunication = (value: string) => {
        switch (value) {
            case 'MOBILEPHONE':
                return 'patient.contact_preference.mobilephone';
            case 'MAIL':
                return 'patient.contact_preference.mail';
        }
    }

    const displayReferralSource = (value: string) => {
        return `external_access.registration.referral_sources.${value}`;
    }

    if (!patientData?.patient) {
        return <></>;
    }

    const confirm = () => {

        updatePatientMutation.mutate(patientData, {
            onSuccess: () => {
                setSuccessfullyCompletedRegistration(true);
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Success,
                    message: 'external_access.registration.patient_creation_success',
                    durationInSeconds: toastMessageDuration,
                    position: SnackbarPosition.TopCenter
                }));

                const redirectLink: RedirectLink = {
                    requestChannel: RequestChannel.Web,
                    patientId: patientData?.patient?.patientId.toString(),
                    requestType: ExternalAccessRequestTypes.ScheduleAppointment,
                    linkCreationDate: new Date(),
                    fullUrl: '',
                    linkId: '/o/schedule-appointment',
                    attributes: [],
                    sentAddress: patientData.patient.mobilePhone,
                    ticketId: ''
                }
                setTimeout(() => {
                    dispatch(setRedirectLink(redirectLink));
                    history.replace('/o/verify-patient-get-mobile');
                }, toastMessageDuration * 1000);
            },
            onError: () => {
                dispatch(addSnackbarMessage({
                    type: SnackbarType.Error,
                    message: 'external_access.registration.patient_registration_submit_failure'
                }));
            }
        });
    }

    return (
        <div className='flex flex-col'>
            <div className='body2'><span className='review-label'>{`${t('external_access.first_name')}: `}</span>{patientData?.patient?.firstName}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.last_name')}: `}</span>{patientData?.patient?.lastName}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.dob')}: `}</span>{utils.formatDate(patientData?.patient?.dateOfBirth)}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.mobile_phone')}: `}</span>{utils.formatPhone(patientData?.patient?.mobilePhone)}</div>
            {
                patientData.patient.email ?
                    <div className='body2'><span className='review-label'>{`${t('external_access.registration.email')}: `}</span>{patientData?.patient?.email}</div>
                    : null
            }
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.address')}: `}</span>{displayAddressField()}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.sex')}: `}</span>{patientData?.patient?.sex}</div>
            <div className='pt-10' />
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.text_consent_short')}: `}</span>{displayConsents('text')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.call_consent_short')}: `}</span>{displayConsents('call')}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.preferred_communication_short')}: `}</span>{t(`${displayPreferredCommunication(patientData?.patient?.contactPreference)}`)}</div>
            <div className='body2'><span className='review-label'>{`${t('external_access.registration.referral_source')}: `}</span>{t(`${displayReferralSource(patientData?.patient?.referralSourceId)}`)}</div>
            <div className='pt-10' />
            {
                insuranceData?.insuranceOption?.value === INSURANCE_PLAN ?
                    <>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_type')}: `}</span>{insuranceData?.insuranceType}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_name')}: `}</span>{insuranceData?.insuranceName}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_name')}: `}</span>{insuranceData?.policyHolderName}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_dob')}: `}</span>{utils.formatDate(insuranceData?.policyHolderDob)}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.policy_holder_relationship')}: `}</span>{insuranceData?.insuranceRelation}</div>
                        <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_member_id')}: `}</span>{insuranceData?.insuranceMemberId}</div>
                        {
                            insuranceData?.groupNumber ?
                                <div className='body2'><span className='review-label'>{`${t('external_access.registration.group_number')}: `}</span>{insuranceData?.groupNumber}</div> :
                                null
                        }
                    </> : <div className='body2'><span className='review-label'>{`${t('external_access.registration.insurance_info')}: `}</span>{t(`${insuranceData?.insuranceOption?.label}`)}</div>
            }
            {
                !successfullyCompletedRegistration &&
                <div className='flex pt-6'>
                    <Button label='common.back' buttonType='secondary-big' className='mr-8 w-36' onClick={() => goBack()} />
                    <Button type='submit' label='common.submit'
                        onClick={() => confirm()}
                        isLoading={updatePatientMutation.isLoading}
                        className='w-36' />
                </div>
            }
        </div>
    );
}

export default RegistrationReviewStep;
