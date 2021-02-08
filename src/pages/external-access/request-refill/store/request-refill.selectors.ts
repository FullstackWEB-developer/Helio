import { RootState } from "../../../../app/store";
import { createSelector } from '@reduxjs/toolkit';
import { Medication } from '../models/medication.model';
export const requestRefillState = (state: RootState) => state.externalAccessState.requestRefillState;

export const selectMedications = createSelector(
    requestRefillState,
    items => items.medications as Medication[]
)

export const selectIsMedicationsLoading = createSelector(
    requestRefillState,
    items => items.isMedicationsLoading as boolean
)

export const selectIsRequestRefillLoading = createSelector(
    requestRefillState,
    items => items.isRequestRefillLoading as boolean
)

export const SelectIsRequestRefillRequestCompleted = createSelector(
    requestRefillState,
    items => items.isRequestRefillRequestCompleted as boolean
)

export const SelectRequestRefillError = createSelector(
    requestRefillState,
    items => items.error as string
)