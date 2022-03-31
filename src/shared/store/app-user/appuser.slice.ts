import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import initialAppUserState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
import {UserStatusUpdate} from '@shared/models/user-status-update.model';
import {LiveAgentStatusInfo} from '@shared/models/live-agent-status-info.model';
import {UserDetail} from '@shared/models';
import {InternalQueueStatus} from '@pages/ccp/models/internal-queue-status';

const appUserSlice = createSlice({
    name: 'appuser',
    initialState: initialAppUserState,
    reducers: {
        setAuthentication(state, {payload}: PayloadAction<AuthenticationInfo>) {
            state.auth = payload
        },
        setAppUserDetails(state, {payload}: PayloadAction<UserDetail>) {
            state.appUserDetails = payload
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
            let internalQueueIndex = state.internalQueueStatuses.findIndex(a => a.userId === state?.appUserDetails?.id);
            if (internalQueueIndex > 1) {
                state.internalQueueStatuses = state.internalQueueStatuses.map((item, index)=> {
                    return index === internalQueueIndex ? {...item, connectStatus : payload.toString()} : item
                })
            }
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
            let internalQueueIndex = state.internalQueueStatuses?.findIndex(a => a.userId === payload.userId);
            if (internalQueueIndex > 1) {
                state.internalQueueStatuses = state.internalQueueStatuses.map((item, index)=> {
                    return index === internalQueueIndex ? {...item, connectStatus : payload.status} : item
                })
            }
        },
        setLogStream(state, {payload}: PayloadAction<LogStream>) {
            state.logStream = payload;
        },
        setInternalQueueStatuses: (state, {payload}: PayloadAction<InternalQueueStatus[]>) => {
            state.internalQueueStatuses = payload.map(item => {
                let liveAgentStatus = state.liveAgentStatuses.find(a => a.userId === item.userId);
                return {
                    ...item,
                    connectStatus: liveAgentStatus ? liveAgentStatus.status : UserStatus.Offline.toString()
                };
            });
        }
    }
});

const convertUserStatusUpdateToLiveAgentStatus = (payload: UserStatusUpdate): LiveAgentStatusInfo | null => {

    let data: LiveAgentStatusInfo = {
        status: payload.status,
        userId: payload.userId,
        timestamp: payload.timestamp,
        chats: [],
        calls: []
    };
    if (payload.activities && payload.activities.length > 0) {
        const activityType = payload.activities[0].channel;
        if (activityType === 'CHAT') {
            data.chats = payload.activities.map((a) => {
                return {
                    timestamp: a.timestamp,
                    customerData: a.customerData
                }
            });
        } else if (activityType === 'VOICE') {
            data.calls = payload.activities.map((a) => {
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
    setAppUserDetails,
    logOut,
    loginInitiated,
    setLoginLoading,
    updateUserStatus,
    setAgentStates,
    setLogStream,
    setInternalQueueStatuses,
    addLiveAgentStatus
} = appUserSlice.actions

export default appUserSlice.reducer
