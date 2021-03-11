import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
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
        },
        setLoginLoading(state, { payload }: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        updateUserStatus(state, { payload }: PayloadAction<UserStatus>) {
            state.status = payload;
        }
    }
});

export const { setAuthentication, logOut, loginInitiated, setLoginLoading, updateUserStatus } = appUserSlice.actions

export default appUserSlice.reducer
