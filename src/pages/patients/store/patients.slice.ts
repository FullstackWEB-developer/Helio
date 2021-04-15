import {VerifiedPatient} from '../models/verified-patient';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './patients.initial-state';
import {Patient} from '../models/patient';
import {ExtendedPatient} from '../models/extended-patient';
import {Appointment} from '../../external-access/appointment/models/appointment.model';

const patientsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        setLoading(state, {payload}: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        setError(state, {payload}: PayloadAction<boolean>) {
            state.isError = payload;
        },
        setPatients(state, { payload }: PayloadAction<Patient[]>) {
            state.patientList = payload;
        },
        setPatient(state, {payload}: PayloadAction<ExtendedPatient>) {
            state.patient = payload;
        },
        clearPatients(state) {
            state.patientList = undefined;
        },
        clearPatient(state) {
            state.patient = undefined;
        },
        setVerifiedPatient(state, { payload }: PayloadAction<VerifiedPatient>) {
            state.verifiedPatient = payload;
        },
        clearVerifiedPatient(state) {
            state.verifiedPatient = undefined;
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
    setPatient,
    clearPatient,
    setVerifiedPatient,
    setAppointments,
    clearAppointments,
    clearVerifiedPatient,
} = patientsSlice.actions

export default patientsSlice.reducer
