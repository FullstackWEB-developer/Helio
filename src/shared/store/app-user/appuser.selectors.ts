import {RootState} from '../../../app/store';
import {createSelector} from '@reduxjs/toolkit';
import {UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';

export const appUserState = (state: RootState) => state.appUserState

export const authenticationSelector = createSelector(
    appUserState,
    state => state.auth
)

export const userFullNameSelector = createSelector(
    appUserState,
    state => state.auth.name
)

export const selectIsLoginLoading = createSelector(
    appUserState,
    state => state.isLoading
)

export const selectUserStatus = createSelector(
    appUserState,
    state => state.status as UserStatus
)

export const selectAccessToken = createSelector(
    appUserState,
    state => state.auth.accessToken
)

export const selectAgentStates = createSelector(
    appUserState,
    state => state.agentStates as AgentState[]
)
