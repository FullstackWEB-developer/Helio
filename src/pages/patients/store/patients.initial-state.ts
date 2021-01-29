import {Patient} from "../models/patient";
import {ExtendedPatient} from "../models/extended-patient";

export interface PatientsState {
    patientList?: Patient[];
    patient?: ExtendedPatient;
    isLoading: boolean;
    isError: boolean;
}

const initialState: PatientsState = {
    patientList: undefined,
    patient: undefined,
    isLoading: false,
    isError: false
}
export default initialState;