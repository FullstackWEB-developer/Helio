import {Patient} from "../models/patient";
import {Appointment} from "../../appointment/models/appointment";
import {ExtendedPatient} from "../models/extended-patient";

export interface PatientsState {
    appointmentList?: Appointment[];
    patientList?: Patient[];
    patient?: ExtendedPatient;
    isLoading: boolean;
    isError: boolean;
    isVerified?: boolean;
}

const initialState: PatientsState = {
    appointmentList: undefined,
    patientList: undefined,
    patient: undefined,
    isLoading: false,
    isError: false,
    isVerified: false
}
export default initialState;
