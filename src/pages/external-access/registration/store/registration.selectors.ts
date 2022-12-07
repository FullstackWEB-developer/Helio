import { createSelector } from '@reduxjs/toolkit';
import { CreatePatientInsuranceModel, CreatePatientRequest } from '@pages/external-access/models/create-patient-request.model';
import { RootState } from '@app/store';
import { RegistrationStep } from '@pages/external-access/models/registration-step.enum';

export const registeredPatientState = (state: RootState) => state.externalAccessState.patientRegistrationState;

export const selectRegisteredPatient = createSelector(registeredPatientState, state => state.patient as CreatePatientRequest | undefined);

export const selectRegisteredPatientInsurance = createSelector(registeredPatientState, state => state.insurance as CreatePatientInsuranceModel);

export const selectCurrentRegistrationStep = createSelector(registeredPatientState, state => state.currentRegistrationStep as RegistrationStep);
