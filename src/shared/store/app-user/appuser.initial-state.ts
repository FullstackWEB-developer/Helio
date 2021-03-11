import {AuthenticationInfo, UserStatus} from './app-user.models';

export interface AppUserState {
    auth: AuthenticationInfo;
    isLoading: boolean;
    status: UserStatus
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    },
    isLoading: false,
    status: UserStatus.Afterwork
}
export default initialState;
