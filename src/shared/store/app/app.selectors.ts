import {RootState} from '../../../app/store';
import {createSelector} from '@reduxjs/toolkit';
export const appState = (state: RootState) => state.appState

export const selectGlobalLoading = createSelector(
    appState,
    state => state.isGlobalLoading as boolean
)
