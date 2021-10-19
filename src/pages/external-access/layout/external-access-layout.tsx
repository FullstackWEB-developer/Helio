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
import {TicketSmsPath} from '@app/paths';
import utils from '@shared/utils/utils';
import {useDispatch} from 'react-redux';
import {logOut} from '@shared/store/app-user/appuser.slice';
export interface ExternalAccessLayoutProps {
    children: ReactNode;
}

const ExternalAccessLayout = ({children}: ExternalAccessLayoutProps) => {
    const {t} = useTranslation();
    const year = dayjs().year();
    const dispatch = useDispatch();
    const webFormsLabResult = useRouteMatch({
        path: '/o/lab-results/:labResultId',
        strict: true,
        sensitive: true
    });

    useEffect(() => {
        if (utils.isSessionExpired()) {
            dispatch(logOut());
        }
    }, [dispatch, logOut])

    const location = useLocation();

    const isSmsTicketPage = location && location.pathname === TicketSmsPath;

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
        'hidden': isSmsTicketPage
    });

    const childrenWrapperClass = classNames('flex-grow xl:px-40 external-access-container', {
        'px-4 pb-36 padding-top': !isSmsTicketPage,
    });

    const footerWrapperClass = classNames('h-16 xl:px-40 external-access-layout-footer body3-medium', {
        'hidden': isSmsTicketPage
    });

    return <>
        <div className={externalAccessLayoutClassnames}>
            {<div className={iconWrapperClass}>
                <div className='flex items-center justify-center h-full md:px-6 md:justify-start'>
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
