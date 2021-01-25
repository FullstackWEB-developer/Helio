import {Patient} from "../models/patient";

export interface PatientsState {
    patientList?: Patient[];
    patient?: Patient;
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