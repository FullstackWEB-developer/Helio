import { RootState } from '../../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { LabResult } from '../models/lab-result.model';
export const requestLabResultState = (state: RootState) => state.externalAccessState.requestLabResultState;

export const selectLabResults = createSelector(
    requestLabResultState,
    items => items.labResultList as LabResult[]
)

export const selectIsLabResultsLoading = createSelector(
    requestLabResultState,
    items => items.isLabResultsLoading as boolean
)

export const selectLabResultsError = createSelector(
    requestLabResultState,
    items => items.error as string
)
