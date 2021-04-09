import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
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
        updateUserStatus(state, { payload }: PayloadAction<UserStatus | string>) {
            state.status = payload;
        },
        setAgentStates(state, { payload }: PayloadAction<AgentState[]>) {
            state.agentStates = payload;
        }
    }
});

export const { setAuthentication, logOut, loginInitiated, setLoginLoading, updateUserStatus, setAgentStates } = appUserSlice.actions

export default appUserSlice.reducer
