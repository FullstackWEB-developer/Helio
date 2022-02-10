import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
import {LiveAgentStatusInfo} from '@shared/models/live-agent-status-info.model';
import {UserDetail} from '@shared/models';
export interface AppUserState {
    auth: AuthenticationInfo;
    appUserDetails?: UserDetail;
    isLoading: boolean;
    status: UserStatus | string;
    agentStates: AgentState[];
    liveAgentStatuses: LiveAgentStatusInfo[];
    logStream?: LogStream
}

const initialAppUserState: AppUserState = {
    auth: {
        isLoggedIn: false,
        isGuestLogin: false
    },
    appUserDetails: undefined,
    isLoading: false,
    status: UserStatus.Offline,
    agentStates: [],
    liveAgentStatuses: [],
    logStream: undefined
}
export default initialAppUserState;
