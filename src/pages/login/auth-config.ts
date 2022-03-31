import * as msal from '@azure/msal-browser';
import {PopupRequest} from '@azure/msal-browser';
import {PublicClientApplication} from '@azure/msal-browser/dist/app/PublicClientApplication';
import utils from '@shared/utils/utils';

export const loginRequest: PopupRequest = {
    scopes: [
        'User.Read',
    ]
};
let msalInstance : PublicClientApplication;
export const getMsalInstance = () => {
    if (msalInstance) {
        return msalInstance;
    } else {
        if (utils.getAppParameter('MsalClientId')) {
            msalInstance = new msal.PublicClientApplication({
                auth: {
                    clientId: utils.getAppParameter('MsalClientId'),
                    authority: 'https://login.microsoftonline.com/' + utils.getAppParameter('MsalTenantId')
                },
                cache: {
                    cacheLocation: 'localStorage',
                    storeAuthStateInCookie: true
                },
                system: {
                    iframeHashTimeout: 10000
                }
            });
            return msalInstance;
        }
    }
}
