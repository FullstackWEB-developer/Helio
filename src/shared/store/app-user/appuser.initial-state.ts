import {AuthenticationInfo, UserStatus} from './app-user.models';
import {AgentState} from '@shared/models/agent-state';

export interface AppUserState {
    auth: AuthenticationInfo;
    isLoading: boolean;
    status: UserStatus | string;
    agentStates: AgentState[];
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    },
    isLoading: false,
    status: UserStatus.Offline,
    agentStates: []
}
export default initialState;
