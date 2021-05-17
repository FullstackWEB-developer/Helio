import * as msal from '@azure/msal-browser';
import {PopupRequest} from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_CLIENTID as string,
        authority: 'https://login.microsoftonline.com/' + process.env.REACT_APP_MSAL_TENANTID,
        validateAuthority: true
    },
    cache: {
        cacheLocation: 'localStorage'
    },
    system: {
        iframeHashTimeout: 10000
    }
};

export const loginRequest: PopupRequest = {
    scopes: [
        'User.Read',
    ]
};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

