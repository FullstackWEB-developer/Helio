import React, {useEffect, useState} from 'react';
import './registration.scss';
import RegistrationStepper from './components/registration-stepper';
import {RegistrationStep} from '../models/registration-step.enum';
import {useTranslation} from 'react-i18next';
import RegistrationForm from './components/registration-form';
import {useDispatch} from 'react-redux';
import { getLookupValues } from '@shared/services/lookups.service';
import {clearVerifiedPatient} from '@pages/patients/store/patients.slice';
import {clearRedirectLink} from '../verify-patient/store/verify-patient.slice';
import {logOut} from '@shared/store/app-user/appuser.slice';
import {useQuery} from 'react-query';
import {QueryStates} from '@constants/react-query-constants';
import {getStates} from '@shared/services/lookups.service';
import {Option} from '@components/option/option';
import {setStates} from '@shared/store/lookups/lookups.slice';
import {cleanRegistrationState} from '@pages/external-access/registration/store/registration.slice';

const Registration = () => {

    const dispatch = useDispatch();
    const [currentStep, setCurrentStep] = useState(RegistrationStep.PersonalInformation);
    const {t} = useTranslation();

    useQuery(QueryStates, () => getStates(),
        {
            onSuccess:(data: any)=> {
                const managedStates = data.map((item: any) => {
                    return {
                        value: item.stateCode,
                        label: item.name
                    } as Option;
                })
                dispatch(setStates(managedStates));
            }
        }
    );

    const goStepForward = () => {
        if (currentStep < RegistrationStep.Review) {
            setCurrentStep(currentStep + 1);
        }
    }

    const goBack = () => {
        if (currentStep > RegistrationStep.PersonalInformation) {
            setCurrentStep(currentStep - 1);
        }
    }

    useEffect(() => {
        dispatch(cleanRegistrationState());
        dispatch(getLookupValues('ReferralSource'));
        dispatch(getLookupValues('InsuranceType'));
        dispatch(getLookupValues('InsuranceHolderRelation'));
        dispatch(clearVerifiedPatient());
        dispatch(clearRedirectLink());
        dispatch(logOut());
    }, [dispatch]);

    useEffect(() => {
        let externalAccessLayout = document.getElementById("external-access-layout");
        
        if(externalAccessLayout){
            externalAccessLayout.scroll({top: 0, behavior: 'smooth'});
        }
    }, [currentStep]);

    const displayStepDescription = () => {
        switch (currentStep) {
            case RegistrationStep.PersonalInformation:
                return `${t('external_access.registration.personal_information_step_image_note')}\n${t('external_access.registration.personal_information_step')}`;
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
