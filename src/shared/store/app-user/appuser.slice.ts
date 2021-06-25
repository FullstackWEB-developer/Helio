import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
import {UserStatusUpdate} from '@shared/models/user-status-update.model';
import {LiveAgentStatusInfo} from '@shared/models/live-agent-status-info.model';
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
        addLiveAgentStatus(state, {payload}: PayloadAction<UserStatusUpdate>) {
            if (!state.liveAgentStatuses) {
                state.liveAgentStatuses = [];
            }
            state.liveAgentStatuses = state.liveAgentStatuses.filter(a => a.userId !== payload.userId);
            const currentAgent = state.liveAgentStatuses.find(a => a.userId === payload.userId);
            if (!currentAgent) {
                const agentInfo = convertUserStatusUpdateToLiveAgentStatus(payload);
                if (agentInfo) {
                    state.liveAgentStatuses.push(agentInfo);
                }
            }
        },
        setLogStream(state, {payload}: PayloadAction<LogStream>) {
            state.logStream = payload;
        }
    }
});

const convertUserStatusUpdateToLiveAgentStatus = (payload: UserStatusUpdate) : LiveAgentStatusInfo | null => {

    let data : LiveAgentStatusInfo = {
        status: payload.status,
        userId: payload.userId,
        timestamp: payload.timestamp,
        chats: [],
        calls: []
    };
    if (payload.activities && payload.activities.length > 0) {
        const activityType = payload.activities[0].channel;
        if (activityType === 'CHAT') {
            data.chats =  payload.activities.map((a) => {
                return {
                    timestamp: a.timestamp,
                    customerData: a.customerData
                }
            });
        } else if (activityType === 'VOICE') {
            data.calls =  payload.activities.map((a) => {
                return {
                    timestamp: a.timestamp,
                    customerData: a.customerData
                }
            });
        }
    }

    return data;
}

export const {
    setAuthentication,
    logOut,
    loginInitiated,
    setLoginLoading,
    updateUserStatus,
    setAgentStates,
    setLogStream,
    addLiveAgentStatus
} = appUserSlice.actions

export default appUserSlice.reducer
