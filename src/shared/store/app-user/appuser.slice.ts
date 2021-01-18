import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import { AuthenticationInfo } from './app-user.models';
const appUserSlice = createSlice({
    name: 'appuser',
    initialState,
    reducers: {
        setAuthentication(state, { payload }: PayloadAction<AuthenticationInfo>) {
            state.auth = payload
        },
        logOut(state) {
            state.auth = initialState.auth
        },
        loginInitiated(state) {
            state.auth = initialState.auth;
        }
    }
});

export const { setAuthentication, logOut, loginInitiated } = appUserSlice.actions

export default appUserSlice.reducer
