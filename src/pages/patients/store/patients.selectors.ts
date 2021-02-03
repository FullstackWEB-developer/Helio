import { RootState } from "../../../app/store";

export const selectAppointmentList = (state: RootState) => state.patientsState.appointmentList;
export const selectPatient = (state: RootState) => state.patientsState.patient;
export const selectPatientList = (state: RootState) => state.patientsState.patientList;
export const selectPatientLoading = (state: RootState) => state.patientsState.isLoading;
export const selectIsPatientError = (state: RootState) => state.patientsState.isError;
export const selectIsPatientVerified = (state: RootState) => state.patientsState.isVerified;
