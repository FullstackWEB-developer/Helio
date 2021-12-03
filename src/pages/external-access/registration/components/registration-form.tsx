import {RegistrationStep} from '@pages/external-access/models/registration-step.enum';
import React from 'react';
import PersonalInformationRegistrationStep from './registration-personal-info';
import CommunicationPreferencesRegistrationStep from './registration-communication-preferences';
import InsuranceInformationRegistrationStep from './registration-insurance-information';
import UploadDocumentsRegistrationStep from './registration-documents';
import RegistrationReviewStep from './registration-review';

const RegistrationForm = ({step, goStepForward, goBack}: {step: RegistrationStep, goStepForward: () => void, goBack: () => void}) => {

    const getDisplayClass = (currentStep: RegistrationStep) => {
        return currentStep === step ? 'block' : 'hidden';
    }

    return (
        <>
            <div className='py-10 w-full'>
                <div className='flex flex-col w-full md:w-2/3'>
                    <div className={getDisplayClass(RegistrationStep.PersonalInformation)}>
                        <PersonalInformationRegistrationStep onPatientUpsert={() => goStepForward()} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.CommunicationPreferences)}>
                        <CommunicationPreferencesRegistrationStep goBack={() => goBack()} onPatientUpdate={() => goStepForward()} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.InsuranceInformation)}>
                        <InsuranceInformationRegistrationStep goBack={() => goBack()} onPatientUpdate={() => goStepForward()} />
                    </div>

                    <div className={getDisplayClass(RegistrationStep.Documents)}>
                        <UploadDocumentsRegistrationStep goStepForward={() => goStepForward()} goBack={() => goBack()} />
                    </div>
                    <div className={getDisplayClass(RegistrationStep.Review)}>
                        <RegistrationReviewStep goBack={() => goBack()} />
                    </div>
                </div>
            </div>
        </>
    )
}

export default RegistrationForm;
