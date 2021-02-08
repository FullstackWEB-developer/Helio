import { Patient } from "../models/patient";
import { ExtendedPatient } from "../models/extended-patient";
import { Appointment } from '../../external-access/appointment/models/appointment';
import {VerifiedPatient} from "../models/verified-patient";

export interface PatientsState {
    appointmentList?: Appointment[];
    patientList?: Patient[];
    patient?: ExtendedPatient;
    isLoading: boolean;
    isError: boolean;
    isVerified?: boolean;
    verifiedPatient?: VerifiedPatient;
}

const initialState: PatientsState = {
    appointmentList: undefined,
    patientList: undefined,
    patient: undefined,
    verifiedPatient: undefined,
    isLoading: false,
    isError: false,
    isVerified: false
}
export default initialState;
