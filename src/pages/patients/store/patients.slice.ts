import { VerifiedPatient } from '../models/verified-patient';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './patients.initial-state';
import { Patient } from '../models/patient';
import { ExtendedPatient } from '../models/extended-patient';
import { Appointment } from '../../external-access/appointment/models/appointment';
import { PatientChartSummary } from '../models/patient-chart-summary';
import { ClinicalDetails } from '../models/clinical-details';
import { Insurance } from '../models/insurance';

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
        setVerifiedPatient(state, { payload }: PayloadAction<VerifiedPatient>) {
            state.verifiedPatient = payload;
            state.isVerified = true;
        },
        clearVerifiedPatient(state) {
            state.verifiedPatient = undefined;
            state.isVerified = false;
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
        },
        setPatientChartSummary(state, { payload }: PayloadAction<PatientChartSummary>) {
            state.patientChartSummary = payload;
            state.isSummaryLoading = false;
        },
        clearPatientSummary(state) {
            state.patientChartSummary = undefined;
        },
        setSummaryLoading(state, { payload }: PayloadAction<boolean>) {
            state.isSummaryLoading = payload;
        },
        setPatientChartClinical(state, { payload }: PayloadAction<ClinicalDetails>) {
            state.patientChartClinical = payload;
            state.isClinicalLoading = false;
        },
        clearPatientClinical(state) {
            state.patientChartClinical = undefined;
        },
        setClinicalLoading(state, { payload }: PayloadAction<boolean>) {
            state.isClinicalLoading = payload;
        },
        setPatientChartInsurance(state, { payload }: PayloadAction<Insurance[]>) {
            state.patientChartInsurance = payload;
            state.isInsuranceLoading = false;
        },
        clearPatientInsurance(state) {
            state.patientChartInsurance = undefined;
        },
        setInsuranceLoading(state, { payload }: PayloadAction<boolean>) {
            state.isInsuranceLoading = payload;
        },
        setSummaryError(state, { payload }: PayloadAction<boolean>) {
            state.isSummaryError = payload;
        },
        setClinicalError(state, { payload }: PayloadAction<boolean>) {
            state.isClinicalError = payload;
        },
        setInsuranceError(state, { payload }: PayloadAction<boolean>) {
            state.isInsuranceError = payload;
        },
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
    setVerifiedPatient,
    setAppointments,
    clearAppointments,
    clearVerifiedPatient,
    setPatientChartSummary,
    setPatientChartClinical,
    setPatientChartInsurance,
    setSummaryLoading,
    setClinicalLoading,
    setInsuranceLoading,
    clearPatientClinical,
    clearPatientInsurance,
    clearPatientSummary,
    setSummaryError,
    setClinicalError,
    setInsuranceError
} = patientsSlice.actions

export default patientsSlice.reducer
