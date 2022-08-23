import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './appuser.initial-state';
import initialAppUserState from './appuser.initial-state';
import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
import {UserStatusUpdate} from '@shared/models/user-status-update.model';
import {LiveAgentStatusInfo} from '@shared/models/live-agent-status-info.model';
import {QuickConnectExtension, UserDetail} from '@shared/models';
import {InternalQueueStatus} from '@pages/ccp/models/internal-queue-status';
import dayjs from 'dayjs';

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
            let internalQueueIndex = state.internalQueueStatuses.findIndex(a => a.userId === payload.userId);
            if (internalQueueIndex > -1) {
                state.internalQueueStatuses = state.internalQueueStatuses.map((item, index)=> {
                    return index === internalQueueIndex ? {...item, connectStatus : payload.status} : item
                })
            }
        },
        updateLiveAgentStatus(state, {payload}: PayloadAction<QuickConnectExtension>) {
            if (!state.liveAgentStatuses) {
                state.liveAgentStatuses = [];
            }
            const item = state.liveAgentStatuses.find(a => a.userId === payload.id);
            if (!!item) {
                state.liveAgentStatuses = state.liveAgentStatuses.filter(a => a.userId !== payload.id);
                state.liveAgentStatuses.push({
                    ...item,
                    status: payload.latestConnectStatus,
                    timestamp: payload.timestamp
                });
            } else {
                state.liveAgentStatuses.push({
                    status: payload.latestConnectStatus,
                    userId: payload.id,
                    timestamp: dayjs.utc(payload.timestamp).local().toDate(),
                    name: `${payload.firstName} ${(payload.lastName)}`
                })
            }
        },
        setLogStream(state, {payload}: PayloadAction<LogStream>) {
            state.logStream = payload;
        },
        setInternalQueueStatuses: (state, {payload}: PayloadAction<InternalQueueStatus[]>) => {
            state.internalQueueStatuses = payload;
            state.liveAgentStatuses = state.liveAgentStatuses.map(liveAgent => {
                const internalQueueUser = payload.find(i => i.userId === liveAgent.userId);
                if (!internalQueueUser){
                    return liveAgent;
                }
                return {...liveAgent, status: internalQueueUser.connectStatus}
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
    setLoginLoading,
    updateUserStatus,
    setAgentStates,
    setLogStream,
    setInternalQueueStatuses,
    addLiveAgentStatus,
    updateLiveAgentStatus
} = appUserSlice.actions

export default appUserSlice.reducer
