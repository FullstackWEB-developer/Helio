import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialAppState from './app.initial-state';
const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setGlobalLoading(state, {payload}: PayloadAction<boolean>) {
            state.isGlobalLoading = payload;
        },
    }
});

export const {
    setGlobalLoading
} = appSlice.actions

export default appSlice.reducer
