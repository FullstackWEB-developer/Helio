import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../../../app/store";
import { Appointment } from '../../external-access/appointment/models/appointment';
import { ExtendedPatient } from '../models/extended-patient';
import { Patient } from '../models/patient';
import { VerifiedPatient } from '../models/verified-patient';
export const patientState = (state: RootState) => state.patientsState

export const selectAppointmentList = createSelector(
    patientState,
    state => state.appointmentList as Appointment[]
)
export const selectPatient = createSelector(
    patientState,
    state => state.patient as ExtendedPatient
)
export const selectPatientList = createSelector(
    patientState,
    state => state.patientList as Patient[]
)
export const selectPatientLoading = createSelector(
    patientState,
    state => state.isLoading as boolean
)
export const selectIsPatientError = createSelector(
    patientState,
    state => state.isError as boolean
)
export const selectIsPatientVerified = createSelector(
    patientState,
    state => state.isVerified as boolean
)
export const selectIsVerifyingPatient = createSelector(
    patientState,
    state => state.isVerifyingPatient as boolean
)
export const selectVerifiedPatent = createSelector(
    patientState,
    state => state.verifiedPatient as VerifiedPatient
)