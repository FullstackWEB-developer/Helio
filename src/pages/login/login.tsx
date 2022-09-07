import Button from '@components/button/button';
import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {AuthenticationInfo} from '@shared/store/app-user/app-user.models';
import {logOut, setAppUserDetails, setAuthentication, setLoginLoading} from '@shared/store/app-user/appuser.slice';
import {Redirect, useHistory} from 'react-router-dom';
import {AuthenticationResult} from '@azure/msal-browser';
import {Dispatch} from '@reduxjs/toolkit';
import {History} from 'history';
import Logger from '@shared/services/logger';
import {authenticationSelector, selectIsLoginLoading} from '@shared/store/app-user/appuser.selectors';
import {resetState} from '@shared/layout/store/layout.slice';
import utils from '@shared/utils/utils';
import Spinner from '@components/spinner/Spinner';
import SvgIcon, {Icon} from '@components/svg-icon';
import LoginPatternDots from './login-pattern-dots';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import './login.scss';
import {getMsalInstance} from '@pages/login/auth-config';
import {getUserDetail} from '@shared/services/user.service';
import useBrowserNotification from '@shared/hooks/useBrowserNotification';
import {addSnackbarMessage} from '@shared/store/snackbar/snackbar.slice';
import {SnackbarType} from '@components/snackbar/snackbar-type.enum';
import i18n from 'i18next';
import {UserDetail} from '@shared/models';
import Snackbar from '@components/snackbar/snackbar';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';

dayjs.extend(utc);

const Login = () => {

    const {t} = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const auth = useSelector(authenticationSelector);
    const isLoading = useSelector(selectIsLoginLoading);

    const initiateLogin = () => {
        dispatch(setLoginLoading(true));
        getMsalInstance()?.loginRedirect();
    }

    const {askNotificationPermission} = useBrowserNotification();
    useEffect(() => {
        if (!isLoading && (utils.isSessionExpired() || auth.isGuestLogin)) {
            utils.logout();
        }
        if (!utils.isLoggedIn()) {
            dispatch(resetState());
            dispatch(setLoginLoading(true));
            getMsalInstance()?.handleRedirectPromise()
                .then(async (info) => {
                    await SetAuthenticationInfo(info, dispatch, history, askNotificationPermission);
                }).catch((err: any) => {
                Logger.getInstance().error('Error logging in', err);
            }).finally(() => dispatch(setLoginLoading(false)))
        }
    }, [dispatch, history]);

    if (isLoading) {
        return <Spinner fullScreen={true} />
    }

    if (utils.isLoggedIn() && (Date.parse(auth.expiresOn) > new Date().valueOf())) {
        return <Redirect to='/dashboard' />
    }

    return (
        <div className='flex flex-row items-center justify-center h-full login'>
            <div className='flex flex-col items-center flex-1 h-full p-10 logo-section'>
                <div className='flex items-end flex-1 pb-28'>
                    <SvgIcon type={Icon.HelioLogo} fillClass='white-icon' className='logo' />
                </div>
                <div className='flex items-end flex-1'>
                    <LoginPatternDots />
                </div>
            </div>
            <div className='flex flex-col items-start justify-center flex-1 h-full pt-10 pl-36'>
                <div className='flex flex-col items-center flex-1'>
                    <div className='flex items-end flex-1'>
                        <div className='content-section'>
                            <h2 className='mb-1.5'>{t('login.title')}</h2>
                            <p className='body-medium '>{t('login.subtitle')}</p>
                        </div>
                    </div>
                    <div className='flex flex-row items-start justify-start flex-1 w-full just mt-14'>
                        <Button data-test-id='login_button' data-testid='login_button' onClick={() => initiateLogin()} label='login.loginButton' />
                    </div>

                </div>
                <div className='flex flex-initial pb-3.5'>
                    <p className='body2-medium'>{t('common.copyright', {year: dayjs.utc().local().year()})}</p>
                </div>
            </div>
            <Snackbar position={SnackbarPosition.TopRight} />
        </div>
    );
}

export default Login;

async function SetAuthenticationInfo(info: AuthenticationResult | null, dispatch: Dispatch<any>, history: string[] | History<unknown>, askNotificationPermission: () => void) {
    if (info !== null) {
        const s = info;
        const auth: AuthenticationInfo = {
            name: s.account?.name as string,
            accessToken: s.idToken,
            expiresOn: s.expiresOn as Date,
            username: s.account?.username as string,
            isLoggedIn: true,
            isGuestLogin: false,
            firstLoginTime: dayjs().toDate()
        };
        dispatch(setAuthentication(auth));

        let userDetails: UserDetail | undefined = undefined;
        let hasError = false;
        try {
            userDetails = await getUserDetail();
        } catch (error : any) {
            if (!!error) {
                if (error.response.status === 404) {
                    hasError = true;
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: i18n.t('login.user_problem')
                    }));
                } else if (error.response.status === 409) {
                    hasError = true;
                    dispatch(addSnackbarMessage({
                        type: SnackbarType.Error,
                        message: i18n.t('login.user_inactive'),
                        autoClose: false
                    }));
                }
            }
        }
        if (hasError) {
            dispatch(logOut());
        } else {
            if (userDetails) {
                if (askNotificationPermission &&
                    (userDetails.callNotification || userDetails.smsNotification || userDetails.emailNotification || userDetails.chatNotification)) {
                    askNotificationPermission();
                }
                dispatch(setAppUserDetails({
                    ...userDetails,
                    fullName: `${userDetails.firstName} ${userDetails.lastName}`
                }));
            }

            history.push('/dashboard');
        }

    }
}

