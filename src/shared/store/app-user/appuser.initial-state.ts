import { AuthenticationInfo } from './app-user.models';

export interface AppUserState {
    auth: AuthenticationInfo;
    isLoading: boolean;
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    },
    isLoading: false
}
export default initialState;
