import { RootState } from "../../../app/store";

export const selectPatient = (state: RootState) => state.patientState.patientId;
