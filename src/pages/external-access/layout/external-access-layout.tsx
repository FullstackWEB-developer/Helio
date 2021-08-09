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
export interface ExternalAccessLayoutProps {
    children: ReactNode;
}

const ExternalAccessLayout = ({children}: ExternalAccessLayoutProps) => {
    const {t} = useTranslation();
    const year = dayjs().year();

    const webFormsLabResult = useRouteMatch({
        path: '/o/lab-results/:labResultId',
        strict: true,
        sensitive: true
    });

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
        'overflow-y-auto': !!(!webFormsLabResult?.isExact)
    })

    return <>
        <div className={externalAccessLayoutClassnames}>
            <div className='h-20 md:px-40 external-access-layout-header'>
                <div className='md:px-6 md:justify-start justify-center flex h-full items-center'>
                    <SvgIcon type={Icon.CwcLogo} />
                </div>
            </div>
            <div className='padding-top flex-grow px-8 md:px-40 pb-36'>{children}</div>
            <div className='h-16 md:px-40 external-access-layout-footer body3-medium'>
                <div className='h-full px-16 flex items-center text-center'>
                    {t('external_access.copyright', {'year': year})}
                </div>
            </div>
        </div>
        <Snackbar position={SnackbarPosition.TopRight} />
        <Snackbar position={SnackbarPosition.TopCenter} />
    </>
}
export default ExternalAccessLayout;
