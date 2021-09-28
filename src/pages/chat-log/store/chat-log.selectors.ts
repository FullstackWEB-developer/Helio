import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';

export const chatLogState = (state: RootState) => state.chatLogState;

export const selectIsChatLogFiltered = createSelector(
    chatLogState,
    state => state.isFiltered as boolean
)
