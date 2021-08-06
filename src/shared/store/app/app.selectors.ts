import {RootState} from '../../../app/store';
import {createSelector} from '@reduxjs/toolkit';
export const appState = (state: RootState) => state.appState

export const selectGlobalLoading = createSelector(
    appState,
    state => state.isGlobalLoading as boolean
)

export const selectModalOverlayActive = createSelector(
    appState,
    state => state.modalOverlayActive as boolean
);