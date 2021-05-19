import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';
import {LogStream} from '@aws-sdk/client-cloudwatch-logs';
export interface AppUserState {
    auth: AuthenticationInfo;
    isLoading: boolean;
    status: UserStatus | string;
    agentStates: AgentState[];
    logStream?: LogStream
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    },
    isLoading: false,
    status: UserStatus.Offline,
    agentStates: [],
    logStream: undefined
}
export default initialState;
