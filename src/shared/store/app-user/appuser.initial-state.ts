import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
import {LiveAgentStatusInfo} from '@shared/models/live-agent-status-info.model';
export interface AppUserState {
    auth: AuthenticationInfo;
    isLoading: boolean;
    status: UserStatus | string;
    agentStates: AgentState[];
    liveAgentStatuses: LiveAgentStatusInfo[];
    logStream?: LogStream
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    },
    isLoading: false,
    status: UserStatus.Offline,
    agentStates: [],
    liveAgentStatuses: [],
    logStream: undefined
}
export default initialState;
