import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '@app/store';
import {AppointmentType} from '@pages/external-access/appointment/models';
import { ExtendedPatient } from '../models/extended-patient';
import { VerifiedPatient } from '../models/verified-patient';
export const patientState = (state: RootState) => state.patientsState

export const selectAppointmentTypes = createSelector(
    patientState,
    state => state.appointmentTypes as AppointmentType[]
)
export const selectPatient = createSelector(
    patientState,
    state => state.patient as ExtendedPatient
)

export const selectPatientLoading = createSelector(
    patientState,
    state => state.isLoading as boolean
)
export const selectIsPatientError = createSelector(
    patientState,
    state => state.isError as boolean
)
export const selectVerifiedPatent = createSelector(
    patientState,
    state => {
        return  state.verifiedPatient as VerifiedPatient;
    }
)
