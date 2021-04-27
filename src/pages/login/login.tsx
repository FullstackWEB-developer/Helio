import Button from '@components/button/button';
import {msalInstance} from './auth-config';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AuthenticationInfo} from '@shared/store/app-user/app-user.models';
import {setAuthentication, setLoginLoading} from '@shared/store/app-user/appuser.slice';
import {Redirect, useHistory} from 'react-router-dom';
import {AuthenticationResult} from '@azure/msal-browser';
import {Dispatch} from '@reduxjs/toolkit';
import {History} from 'history';
import Logger from '@shared/services/logger';
import {authenticationSelector, selectIsLoginLoading} from '@shared/store/app-user/appuser.selectors';
import {resetState} from '@shared/layout/store/layout.slice';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import HelioLogo from '@icons/helio-logo';

const Login = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(authenticationSelector);
    const isLoading = useSelector(selectIsLoginLoading);

    const initiateLogin = () => {
        dispatch(setLoginLoading(true));
        msalInstance.loginRedirect();
    }

    useEffect(() => {
        dispatch(resetState());
        dispatch(setLoginLoading(true));
        msalInstance.handleRedirectPromise()
            .then((info) => {
                SetAuthenticationInfo(info, dispatch, history);
            }).catch((err: any) => {
                Logger.getInstance().error('Error logging in', err);
            }).finally(() => dispatch(setLoginLoading(false)))
    }, [dispatch, history]);

    if (isLoading) {
        return <ThreeDots />
    }

    if (auth.isLoggedIn && (Date.parse(auth.expiresOn) > new Date().valueOf())) {
        return <Redirect to='/dashboard'/>
    }


    return (
        <div className='h-full flex justify-center items-center'>
            <div className='p-24 w-full flex  flex-col items-center space-y-8 border shadow-lg'>
                <HelioLogo className='fill-current text-primary-600' />
                <Button data-test-id='login_button' onClick={() => initiateLogin()} label={'login.loginButton'} />
            </div>
        </div>
    );
}

export default Login;

function SetAuthenticationInfo(info: AuthenticationResult | null, dispatch: Dispatch<any>, history: string[] | History<unknown>) {
    if (info !== null) {
        const s = info;
        const auth: AuthenticationInfo = {
            name: s.account?.name as string,
            accessToken: s.idToken,
            expiresOn: s.expiresOn as Date,
            username: s.account?.username as string,
            isLoggedIn: true
        };
        dispatch(setAuthentication(auth));
        history.push('/dashboard');
    }
}

