import * as msal from "@azure/msal-browser";

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_MSAL_CLIENTID as string,
        authority: 'https://login.microsoftonline.com/' + process.env.REACT_APP_MSAL_TENANTID as string,
        validateAuthority: true
    },

};

export const msalInstance = new msal.PublicClientApplication(msalConfig);

