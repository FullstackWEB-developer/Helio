import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './patients.initial-state';
import { Patient } from "../models/patient";
import { ExtendedPatient } from "../models/extended-patient";
import { Appointment } from '../../external-access/appointment/models/appointment';

const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        setLoading(state, { payload }: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        setError(state, { payload }: PayloadAction<boolean>) {
            state.isError = payload;
        },
        setPatients(state, { payload }: PayloadAction<Patient[]>) {
            state.patientList = payload;
        },
        selectPatient(state, { payload }: PayloadAction<ExtendedPatient>) {
            state.patient = payload;
        },
        clearPatients(state) {
            state.patientList = undefined;
        },
        clearPatient(state) {
            state.patient = undefined;
        },
        setPatientIsVerified(state, { payload }: PayloadAction<boolean>) {
            state.isVerified = payload;
        },
        setAppointments(state, { payload }: PayloadAction<Appointment[]>) {
            state.appointmentList = payload;
            state.isLoading = false;
        },
        clearAppointments(state) {
            state.appointmentList = undefined;
        }
    }
});

export const {
    setLoading,
    setError,
    setPatients,
    clearPatients,
    selectPatient,
    clearPatient,
    setPatientIsVerified,
    setAppointments,
    clearAppointments
} = patientsSlice.actions

export default patientsSlice.reducer
