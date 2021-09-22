import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialCallsLogState from '@pages/calls-log/store/calls-log.initial-state';

const callsLogSlice = createSlice({
    name: 'callsLogSlice',
    initialState: initialCallsLogState,
    reducers: {
        setIsCallsLogFiltered(state, {payload}: PayloadAction<boolean>) {
            state.isFiltered = payload;
        }
    }
});

export const {
    setIsCallsLogFiltered
} = callsLogSlice.actions

export default callsLogSlice.reducer
