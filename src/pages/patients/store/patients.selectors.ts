import { RootState } from "../../../app/store";

export const selectPatient = (state: RootState) => state.patientsState.patient;
export const selectPatientList = (state: RootState) => state.patientsState.patientList;
export const selectPatientLoading = (state: RootState) => state.patientsState.isLoading;
export const selectIsPatientError = (state: RootState) => state.patientsState.isError;