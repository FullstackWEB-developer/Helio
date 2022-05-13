import React, {ReactNode, useEffect} from 'react';
import './external-access-layout.scss';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import Snackbar from '@components/snackbar/snackbar';
import {SnackbarPosition} from '@components/snackbar/snackbar-position.enum';
import '../../../themes/cwc-theme.scss';
import SvgIcon, {Icon} from '@shared/components/svg-icon';
import {useRouteMatch} from 'react-router';
import classNames from 'classnames';
import {useLocation} from 'react-router-dom';
import {TicketEmailPath, TicketSmsPath} from '@app/paths';
import utils from '@shared/utils/utils';
import {useDispatch, useSelector} from 'react-redux';
import {logOut} from '@shared/store/app-user/appuser.slice';
import { useIdleTimer } from 'react-idle-timer';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';

export interface ExternalAccessLayoutProps {
    children: ReactNode;
}

const ExternalAccessLayout = ({children}: ExternalAccessLayoutProps) => {
    const {t} = useTranslation();
    const year = dayjs().year();
    const dispatch = useDispatch();
    const auth = useSelector(authenticationSelector);
    const webFormsLabResult = useRouteMatch({
        path: '/o/lab-results/:labResultId',
        strict: true,
        sensitive: true
    });

    useEffect(() => {
        if (utils.isSessionExpired()) {
            dispatch(logOut());
        }
    }, [dispatch])

    const location = useLocation();

    const isSmsTicketPage = location && location.pathname === TicketSmsPath;
    const isEmailPage = location && location.pathname === TicketEmailPath;

    useEffect(() => {
        const bodyEl = document.getElementsByTagName('body')[0];
        if (bodyEl.classList.contains('default')) {
            bodyEl.classList.replace('default', 'cwc-theme');
        }

        if (webFormsLabResult?.isExact) {
            bodyEl.classList.remove('overflow-y-hidden');
        }
        else {
            if (!bodyEl.classList.contains('overflow-y-hidden')) {
                bodyEl.classList.add('overflow-y-hidden');
            }
        }
    }, [webFormsLabResult]);

    const externalAccessLayoutClassnames = classNames('flex flex-col justify-between flex-grow', {
        'overflow-y-auto': (!webFormsLabResult?.isExact)
    });

    const iconWrapperClass = classNames('h-20 xl:px-40 external-access-layout-header', {
        'hidden': isSmsTicketPage || isEmailPage
    });

    const childrenWrapperClass = classNames('flex-grow xl:px-40 external-access-container', {
        'px-4 pb-36 padding-top': !isSmsTicketPage && !isEmailPage
    });

    const footerWrapperClass = classNames('h-16 xl:px-40 external-access-layout-footer body3-medium', {
        'hidden': isSmsTicketPage || isEmailPage
    });

    const onIdle = () => {
        if(isIdle() && auth.isGuestLogin){
            dispatch(logOut());
        }
    }

    const {
        isIdle,
    } = useIdleTimer({
        onIdle,
        timeout: Number(utils.getAppParameter("WebformsInactiveTimeout")) * 60000,
        events: [
            'mousemove',
            'touchmove'
        ]
    })

    return <>
        <div className={externalAccessLayoutClassnames}>
            {<div className={iconWrapperClass}>
                <div className='flex items-center justify-center h-full md:justify-start'>
                    <SvgIcon type={Icon.CwcLogo}/>
                </div>
            </div>}
            <div className={childrenWrapperClass}>{children}</div>
            <div className={footerWrapperClass}>
                <div className='flex items-center h-full px-16 text-center'>
                    {t('external_access.copyright', {'year': year})}
                </div>
            </div>
        </div>
        <Snackbar position={SnackbarPosition.TopRight} />
        <Snackbar position={SnackbarPosition.TopCenter} />
    </>
}
export default ExternalAccessLayout;
