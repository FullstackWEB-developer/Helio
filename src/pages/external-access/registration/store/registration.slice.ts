import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './registration.initial-state';
import { CreatePatientInsuranceModel, CreatePatientRequest } from '@pages/external-access/models/create-patient-request.model';
import { RegistrationStep } from '@pages/external-access/models/registration-step.enum';

const registrationSlice = createSlice({
  name: 'patientRegistration',
  initialState,
  reducers: {
    setRegisteredPatient(state, { payload }: PayloadAction<CreatePatientRequest>) {
      state.patient = payload;
    },
    cleanRegistrationState(state) {
      state.patient = undefined;
      state.insurance = undefined;
      state.currentRegistrationStep = RegistrationStep.PersonalInformation;
    },
    setRegisteredPatientInsurance(state, { payload }: PayloadAction<CreatePatientInsuranceModel>) {
      state.insurance = payload;
    },
    setCurrentRegistrationStep(state, { payload }: PayloadAction<RegistrationStep>) {
      state.currentRegistrationStep = payload;
    },
  },
});

export const { setRegisteredPatient, cleanRegistrationState, setRegisteredPatientInsurance, setCurrentRegistrationStep } = registrationSlice.actions;

export default registrationSlice.reducer;
