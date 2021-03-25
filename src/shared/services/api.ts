import axios from 'axios';
import { InteractionRequiredAuthError } from '@azure/msal-common';
import { Dispatch } from '@reduxjs/toolkit';
import { logOut } from '../store/app-user/appuser.slice';
import { loginRequest, msalInstance } from '../../pages/login/auth-config';
import Logger from './logger';

const logger = Logger.getInstance();

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_ENDPOINT
});

Api.interceptors.request.use(async (config) => {
    config.headers['x-api-challenge'] = localStorage.getItem('challenge') || 'no-key-found';
    const token = await refreshAccessToken();
    if (token) {
        config.headers.Authorization = token.idToken;
    }
    return config;
},
    (error) => Promise.reject(error)
);

export const refreshAccessToken = async () => {
    const accounts = msalInstance.getAllAccounts();
    const account = accounts[0] || undefined;
    if (account) {
        return  await msalInstance.acquireTokenSilent({
            ...loginRequest,
            account: account
        }).catch(async error => {
            if (error instanceof InteractionRequiredAuthError) {
                return await msalInstance
                    .acquireTokenPopup(loginRequest)
                    .catch((error) => {
                        logger.error('Error logging in popup ' + JSON.stringify(error));
                        return null;
                    });
            } else {
                logger.error('Error refreshing token.');
            }
        });
    }
};

Api.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status !== 401) {
                return Promise.reject(error);
            }
            signOut();
        }
)

const signOut = () => {
    return (dispatch: Dispatch) => {
        dispatch(logOut());
        msalInstance.logout()
            .then(() => {
                logger.info('Logged out successfully!');
            })
            .catch((reason: any) => {
                logger.error('Error logging out ' + JSON.stringify(reason));
            });
    }
}

export default Api;
