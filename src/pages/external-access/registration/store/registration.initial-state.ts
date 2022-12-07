import { CreatePatientInsuranceModel, CreatePatientRequest } from '@pages/external-access/models/create-patient-request.model';
import { RegistrationStep } from '@pages/external-access/models/registration-step.enum';

export interface PatientRegistrationState {
  patient?: CreatePatientRequest;
  insurance?: CreatePatientInsuranceModel;
  currentRegistrationStep: RegistrationStep;
}

const initialState: PatientRegistrationState = {
  patient: undefined,
  insurance: undefined,
  currentRegistrationStep: RegistrationStep.PersonalInformation,
};
export default initialState;
