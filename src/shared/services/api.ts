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
import dayjs from 'dayjs';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import {clearVerifiedPatient} from '@pages/patients/store/patients.slice';
import {setVerifiedLink} from '@pages/external-access/verify-patient/store/verify-patient.slice';

const logger = Logger?.getInstance();
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
                let forceRefresh = false;
                const auth = store.getState()?.appUserState?.auth;
                if(auth && auth.expiresOn && dayjs(auth.expiresOn) < dayjs().add(45, 'minutes')) {
                    forceRefresh = true;
                }
                const response = await getMsalInstance()?.acquireTokenSilent({
                    ...loginRequest,
                    account: account,
                    forceRefresh
                });

                if (response) {
                    const newAuth: AuthenticationInfo = {
                        ...auth,
                        name: response.account?.name as string,
                        accessToken: response.idToken,
                        expiresOn: response.expiresOn as Date,
                        username: response.account?.username as string
                    };
                    const currentToken = auth?.accessToken;
                    if (newAuth?.accessToken !== currentToken) {
                        store.dispatch(setAuthentication(newAuth));
                    }
                    return response.idToken;
                }
            } catch (error: any) {

                if (error instanceof InteractionRequiredAuthError) {
                    if (getMsalInstance() !== undefined) {
                        let errResponse =  await getMsalInstance()!
                            .acquireTokenPopup(loginRequest)
                            .catch((error) => {
                                logger.error('Error logging in popup ' + JSON.stringify(error));
                                return null;
                            });
                        return errResponse?.idToken;
                    }
                } else {
                    console.error('Error refreshing token ' + JSON.stringify(error));
                }
            }
        }
    }
};

Api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 403) {
            store.dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: i18n.t('security.not_authorized')
            }));
        }
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }
        const userState = store.getState().appUserState;
        if (!userState.auth.isGuestLogin && userState.auth?.isLoggedIn) {
            signOut();
        }

        if (!userState.auth.isGuestLogin && !userState.auth?.isLoggedIn) {
            window.location.href = '/login';
        }

        if (store.getState().appUserState.auth.isGuestLogin) {
            store.dispatch(clearVerifiedPatient());
            store.dispatch(setVerifiedLink(''));
            store.dispatch(addSnackbarMessage({
                type: SnackbarType.Error,
                message: 'login.session_timeout_guest',
                position: SnackbarPosition.TopCenter,
                durationInSeconds: 10
            }));
            const link = store.getState().appUserState.auth.authenticationLink;
            store.dispatch(logOut());
            window.location.href = link;
            return;
        }
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
