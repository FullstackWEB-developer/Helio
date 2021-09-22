import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';

export const callsLogState = (state: RootState) => state.callsLogState;

export const selectIsCallsLogFiltered = createSelector(
    callsLogState,
    state => state.isFiltered as boolean
)
