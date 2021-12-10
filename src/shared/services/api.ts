import axios from 'axios';
import {InteractionRequiredAuthError} from '@azure/msal-common';
import {logOut, setAuthentication} from '../store/app-user/appuser.slice';
import {getMsalInstance, loginRequest} from '@pages/login/auth-config';
import Logger from './logger';
import store from '../../app/store';
import {AuthenticationInfo} from '../store/app-user/app-user.models';
import utils from '@shared/utils/utils';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import i18n from "i18next";

const logger = Logger.getInstance();
const Api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

Api.interceptors.request.use(async (config) => {
    config.headers['x-api-challenge'] = localStorage.getItem('challenge') || 'no-key-found';
    config.headers['X-Api-Key'] = utils.getAppParameter('AmazonApiPublicKey');
    config.headers['TimeZoneOffset'] = (new Date()).getTimezoneOffset();
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

    const accounts = getMsalInstance()?.getAllAccounts();
    if (accounts && accounts[0]) {
        const account = accounts[0] || undefined;

        if (account) {

            try {
                const response = await getMsalInstance()?.acquireTokenSilent({
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
                    if (auth?.accessToken !== currentToken) {
                        store.dispatch(setAuthentication(auth));
                    }
                    return response.idToken;
                }
            } catch (error: any) {
                if (error instanceof InteractionRequiredAuthError) {
                    if (getMsalInstance() !== undefined) {
                        return await getMsalInstance()!
                            .acquireTokenPopup(loginRequest)
                            .catch((error) => {
                                logger.error('Error logging in popup ' + JSON.stringify(error));
                                return null;
                            });
                    }
                } else {
                    logger.error('Error refreshing token.', error);
                }
            }
        }
    }
};

Api.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 403) {
            store.dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: i18n.t('security.not_authorized')
            }));
        }
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
    getMsalInstance()?.logoutRedirect()
        .then(() => {
            logger.info('Logged out successfully!');
        })
        .catch((reason: any) => {
            logger.error('Error logging out ' + JSON.stringify(reason));
        });
}

export default Api;
