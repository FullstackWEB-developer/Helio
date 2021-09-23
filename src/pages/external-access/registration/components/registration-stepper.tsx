import React from "react";
import {useTranslation} from "react-i18next";
import {RegistrationStep} from "../../models/registration-step.enum";

const RegistrationStepper = ({step, stepsNumber}: {step: RegistrationStep, stepsNumber: number}) => {
    const {t} = useTranslation();
    const stepWidth = {
        width: `${(1 / stepsNumber) * 100}%`
    }

    const displayStepDescription = (step: RegistrationStep) => {
        switch (step) {
            case RegistrationStep.PersonalInformation:
                return t('external_access.registration.personal_information');
            case RegistrationStep.CommunicationPreferences:
                return t('external_access.registration.communication_preferences');
            case RegistrationStep.InsuranceInformation:
                return t('external_access.registration.insurance_information');
            case RegistrationStep.Documents:
                return t('external_access.registration.documents');
            case RegistrationStep.Review:
                return t('external_access.registration.review');
        }
    }
    return (
        <div className='w-full flex pb-8'>
            {
                [...Array(stepsNumber)].map((el, index) =>
                    <div key={`registration-step-${index}`} className={`flex flex-col${index !== stepsNumber - 1 ? ' pr-1' : ''}`} style={stepWidth}>
                        <div className={`registration-step ${index === step - 1 ? 'active' : index < step - 1 ? 'inactive-left' : 'inactive-right'}`}></div>
                        <div className={`mt-4 body2 break-words step-description-${index === step - 1 ? 'active' : index < step - 1 ? 'inactive-left' : 'inactive-right'}`}>{displayStepDescription(index + 1)}</div>
                    </div>
                )
            }
        </div>
    );
}

export default RegistrationStepper;