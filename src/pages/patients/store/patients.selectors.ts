import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import { Appointment } from '../../external-access/appointment/models/appointment.model';
import { ExtendedPatient } from '../models/extended-patient';
import { VerifiedPatient } from '../models/verified-patient';
import { Insurance } from '../models/insurance';
import { ClinicalDetails } from '../models/clinical-details';
export const patientState = (state: RootState) => state.patientsState

export const selectAppointmentList = createSelector(
    patientState,
    state => state.appointmentList as Appointment[]
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

export const selectPatientInsurance = createSelector(
    patientState,
    state => state.patientChartInsurance as Insurance[]
)

export const selectPrimaryInsurance = createSelector(
    patientState,
    state => {
        if (state.patientChartInsurance && state.patientChartInsurance.length > 0) {
            return state.patientChartInsurance[0] as Insurance
        } else {
            return undefined;
        }
    }
)

export const selectPatientClinical = createSelector(
    patientState,
    state => state.patientChartClinical as ClinicalDetails
)

export const selectClinicalLoading = createSelector(
    patientState,
    state => state.isClinicalLoading as boolean
)

export const selectPatientInCollectionsBalance = createSelector(
    patientState,
    state => state.patient?.patientInCollectionsBalance as number
)
