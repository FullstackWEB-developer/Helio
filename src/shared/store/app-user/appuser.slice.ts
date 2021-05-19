import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
const appUserSlice = createSlice({
    name: 'appuser',
    initialState,
    reducers: {
        setAuthentication(state, {payload}: PayloadAction<AuthenticationInfo>) {
            state.auth = payload
        },
        logOut(state) {
            state.auth = initialState.auth
        },
        loginInitiated(state) {
            state.auth = initialState.auth;
        },
        setLoginLoading(state, {payload}: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        updateUserStatus(state, {payload}: PayloadAction<UserStatus | string>) {
            state.status = payload;
        },
        setAgentStates(state, {payload}: PayloadAction<AgentState[]>) {
            state.agentStates = payload;
        },
        setLogStream(state, {payload}: PayloadAction<LogStream>) {
            state.logStream = payload;
        }
    }
});

export const {setAuthentication, logOut, loginInitiated, setLoginLoading, updateUserStatus, setAgentStates,
    setLogStream} = appUserSlice.actions

export default appUserSlice.reducer
