import {
    CreatePatientInsuranceModel,
    CreatePatientRequest
} from '@pages/external-access/models/create-patient-request.model';

export interface PatientRegistrationState {
    patient?: CreatePatientRequest;
    insurance?: CreatePatientInsuranceModel
}

const initialState: PatientRegistrationState = {
    patient: undefined,
    insurance: undefined
}
export default initialState;
