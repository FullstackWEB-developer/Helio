import { AuthenticationInfo } from './app-user.models';

export interface AppUserState {
    auth: AuthenticationInfo;
}

const initialState: AppUserState = {
    auth: {
        isLoggedIn: false
    }
}
export default initialState;