import axios from 'axios';
import {InteractionRequiredAuthError} from '@azure/msal-common';
import {logOut, setAuthentication} from '../store/app-user/appuser.slice';
import {loginRequest, msalInstance} from '@pages/login/auth-config';
import Logger from './logger';
import store from '../../app/store';
import {AuthenticationInfo} from '../store/app-user/app-user.models';

const logger = Logger.getInstance();

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

Api.interceptors.request.use(async (config) => {
    config.headers['x-api-challenge'] = localStorage.getItem('challenge') || 'no-key-found';
    config.headers['X-Api-Key'] = process.env.REACT_APP_AWS_API_KEY;
    const token = await refreshAccessToken();
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
},
    (error) => Promise.reject(error)
);

export const refreshAccessToken = async () => {
    if (isCustomToken()) {
        return store.getState().appUserState.auth.accessToken;
    }

    const isLoggedIn = store.getState().appUserState.auth.isLoggedIn;
    if (!isLoggedIn) {
        return null;
    }

    const accounts = msalInstance.getAllAccounts();
    const account = accounts[0] || undefined; 

    if (account) {

        try {
            const response = await msalInstance.acquireTokenSilent({
                ...loginRequest,
                account: account
            });

            if (response) {
                const auth: AuthenticationInfo = {
                    name: response.account?.name as string,
                    accessToken: response.idToken,
                    expiresOn: response.expiresOn as Date,
                    username: response.account?.username as string,
                    isLoggedIn: true
                };
                const currentToken = store.getState().appUserState?.auth?.accessToken;
                if(auth?.accessToken !== currentToken)
                {
                    store.dispatch(setAuthentication(auth));
                }                
                return response.idToken;
            }            
        }
        catch(error: any)
        {
            if (error instanceof InteractionRequiredAuthError) {
                return await msalInstance
                    .acquireTokenPopup(loginRequest)
                    .catch((error) => {
                        logger.error('Error logging in popup ' + JSON.stringify(error));
                        return null;
                    });
            } else {
                logger.error('Error refreshing token.', error);
            }
        }
    }
};

Api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status !== 401) {
            return Promise.reject(error);
        }

        if (store.getState().appUserState.auth.authenticationLink) {
            window.location.replace(store.getState().appUserState.auth.authenticationLink);
            return;
        }

        signOut();
    }
)

const isCustomToken = (): boolean => {
    return store.getState().appUserState.auth.accessToken
        && store.getState().appUserState.auth.accessToken.startsWith('*CAT*');
}

const signOut = () => {
    store.dispatch(logOut());
    msalInstance.logout()
        .then(() => {
            logger.info('Logged out successfully!');
        })
        .catch((reason: any) => {
            logger.error('Error logging out ' + JSON.stringify(reason));
        });
}

export default Api;
