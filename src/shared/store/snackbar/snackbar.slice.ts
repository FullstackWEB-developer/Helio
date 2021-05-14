import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';
import initialSnackbarState from './snackbar.initial-state';

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState: initialSnackbarState,
    reducers: {
        addSnackbarMessage(state, {payload}: PayloadAction<SnackbarMessageModel>) {
            payload.id = Math.random().toString(36).substr(2, 9);
            state.messages = [...state.messages, payload];
        },
        removeSnackbarMessage(state, {payload}: PayloadAction<string>) {
            state.messages = state.messages.filter(a => a.id !== payload);
        }
    }
});

export const {
    addSnackbarMessage,
    removeSnackbarMessage
} = snackbarSlice.actions

export default snackbarSlice.reducer