import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {SnackbarMessageModel} from '@components/snackbar/snackbar-message.model';
import initialSnackbarState from './snackbar.initial-state';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

const snackbarSlice = createSlice({
    name: 'snackbar',
    initialState: initialSnackbarState,
    reducers: {
        addSnackbarMessage(state, {payload}: PayloadAction<SnackbarMessageModel>) {
            payload.id = Math.random().toString(36).substr(2, 9);
            if (!payload.position) {
                payload.position = SnackbarPosition.TopRight;
            }
            state.messages = [...state.messages, payload];
        },
        removeSnackbarMessage(state, {payload}: PayloadAction<string>) {
            state.messages = state.messages.filter(a => a.id !== payload);
        },
        removeAllSnackbarMessages(state) {
            state.messages = [];
        }
    }
});

export const {
    addSnackbarMessage,
    removeSnackbarMessage,
    removeAllSnackbarMessages
} = snackbarSlice.actions

export default snackbarSlice.reducer
