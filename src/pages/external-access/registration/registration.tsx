import React, {useEffect, useState} from 'react';
import './registration.scss';
import RegistrationStepper from './components/registration-stepper';
import {RegistrationStep} from '../models/registration-step.enum';
import {useTranslation} from 'react-i18next';
import RegistrationForm from './components/registration-form';
import {useDispatch} from 'react-redux';
import {getLookupValues} from '@pages/tickets/services/tickets.service';
import {clearVerifiedPatient} from '@pages/patients/store/patients.slice';
import {clearRedirectLink} from '../verify-patient/store/verify-patient.slice';
import {logOut} from '@shared/store/app-user/appuser.slice';

const Registration = () => {

    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(RegistrationStep.PersonalInformation);
    const {t} = useTranslation();
    const goStepForward = (uploadingDocumentsRequired: boolean) => {
        if (currentStep < RegistrationStep.Review) {
            setCurrentStep(currentStep + determineStepIncrement(uploadingDocumentsRequired));
        }
    }

    const goBack = (uploadingDocumentsRequired: boolean) => {
        if (currentStep > RegistrationStep.PersonalInformation) {
            setCurrentStep(currentStep - determineStepDecrement(uploadingDocumentsRequired));
        }
    }

    const determineStepIncrement = (uploadingDocumentsRequired: boolean) => {
        switch (currentStep) {
            case RegistrationStep.PersonalInformation:
            case RegistrationStep.CommunicationPreferences:
            case RegistrationStep.Documents:
                return 1;
            case RegistrationStep.InsuranceInformation:
                return uploadingDocumentsRequired ? 1 : 2;
            case RegistrationStep.Review:
            default:
                return 0;
        }
    }

    const determineStepDecrement = (uploadingDocumentsRequired: boolean) => {
        switch (currentStep) {
            case RegistrationStep.CommunicationPreferences:
            case RegistrationStep.InsuranceInformation:
            case RegistrationStep.Documents:
                return 1;
            case RegistrationStep.Review:
                return uploadingDocumentsRequired ? 1 : 2;
            case RegistrationStep.PersonalInformation:
            default:
                return 0;
        }
    }

    useEffect(() => {        
        dispatch(getLookupValues('ReferralSource'));
        dispatch(getLookupValues('InsuranceType'));
        dispatch(getLookupValues('InsuranceHolderRelation'));
        dispatch(clearVerifiedPatient());
        dispatch(clearRedirectLink());
        dispatch(logOut());
    }, [dispatch]);

    const displayStepDescription = () => {
        switch (currentStep) {
            case RegistrationStep.PersonalInformation:
                return t('external_access.registration.personal_information_step');
            case RegistrationStep.CommunicationPreferences:
                return t('external_access.registration.communication_preference_step');
            case RegistrationStep.InsuranceInformation:
                return `${t('external_access.registration.insurance_information_step')}\n${t('external_access.registration.insurance_information_step_2')}`;
            case RegistrationStep.Documents:
                return t('external_access.registration.documents_step');
            case RegistrationStep.Review:
                return t('external_access.registration.confirmation_step');
        }
    }

    return (
        <div>
            <RegistrationStepper step={currentStep} stepsNumber={5} />
            <h4 className='pb-11'>{t('external_access.registration.complete_registration')}</h4>
            <div className='whitespace-pre-line w-11/12'>{displayStepDescription()}</div>
            <RegistrationForm step={currentStep} goStepForward={goStepForward} goBack={goBack} />
        </div>
    );
}

export default Registration;