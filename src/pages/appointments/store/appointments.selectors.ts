import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
export const appointmentsState = (state: RootState) => state.appointmentsState

export const selectHotSpots = createSelector(
    appointmentsState,
    state => state.hotspots
)

export const selectIsHotspotsLoading = createSelector(
    appointmentsState,
    state => state.isHotspotsLoading
)

export const selectIsHotspotsError = createSelector(
    appointmentsState,
    state => state.isHotspotsError
)
