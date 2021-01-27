import { useTranslation } from 'react-i18next';
import Button from '../../shared/components/button/button';
import { ReactComponent as HelioLogo } from '../../shared/icons/helio-logo.svg';
import { msalInstance } from "./auth-config";
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AuthenticationInfo } from '../../shared/store/app-user/app-user.models';
import { setAuthentication } from '../../shared/store/app-user/appuser.slice';
import { Redirect, useHistory } from "react-router-dom";
import { AuthenticationResult } from '@azure/msal-browser';
import { Dispatch } from '@reduxjs/toolkit';
import { History } from 'history';
import Logger from '../../shared/services/logger';
import { authenticationSelector } from '../../shared/store/app-user/appuser.selectors';
const Login = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(authenticationSelector);
    useEffect(() => {
        msalInstance.handleRedirectPromise()
            .then((info) => {
                SetAuthenticationInfo(info, dispatch, history);
            }).catch((err: any) => {
                Logger.getInstance().error("Error logging in", err);
            });
    }, [dispatch, history]);

    if (auth.isLoggedIn && (Date.parse(auth.expiresOn) > new Date().valueOf())) {
        return <Redirect to='/' />
    }

    return (
        <div className="h-full flex justify-center items-center">
            <div className="p-32 w-full flex flex-col items-center space-y-8 border shadow-lg">
                <HelioLogo></HelioLogo>
                <Button data-test-id="login_button" onClick={() => msalInstance.loginRedirect()} label={t("login.loginButton")}></Button>
            </div>
        </div>
    );
}

export default Login;

function SetAuthenticationInfo(info: AuthenticationResult | null, dispatch: Dispatch<any>, history: string[] | History<unknown>) {
    if (info !== null) {
        const s = info as AuthenticationResult;
        let auth: AuthenticationInfo = {
            name: s.account?.name as string,
            accessToken: s.idToken,
            expiresOn: s.expiresOn as Date,
            username: s.account?.username as string,
            isLoggedIn: true
        };
        dispatch(setAuthentication(auth));
        history.push('/');
    }
}

