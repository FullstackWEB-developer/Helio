import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './registration.initial-state';
import {
    CreatePatientInsuranceModel,
    CreatePatientRequest
} from '@pages/external-access/models/create-patient-request.model';

const registrationSlice = createSlice({
    name: 'patientRegistration',
    initialState,
    reducers: {
        setRegisteredPatient(state, {payload}: PayloadAction<CreatePatientRequest>) {
            state.patient = payload;
        },
        cleanRegistrationState(state) {
            state.patient = undefined;
            state.insurance = undefined;
        },
        setRegisteredPatientInsurance(state, {payload}: PayloadAction<CreatePatientInsuranceModel>) {
            state.insurance = payload;
        },
    }
});

export const {
    setRegisteredPatient,
    cleanRegistrationState,
    setRegisteredPatientInsurance
} = registrationSlice.actions

export default registrationSlice.reducer
