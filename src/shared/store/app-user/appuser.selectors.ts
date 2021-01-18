import { RootState } from '../../../app/store';

export const authenticationSelector = (state: RootState) => {
    return state.appUserState.auth;
}