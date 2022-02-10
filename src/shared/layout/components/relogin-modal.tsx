import {useTranslation} from 'react-i18next';
import Button from '@components/button/button';
import SvgIcon, {Icon} from '@components/svg-icon';
import './relogin-modal.scss';
import classname from 'classnames';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {authenticationSelector} from '@shared/store/app-user/appuser.selectors';
import dayjs from 'dayjs';
import utils from '@shared/utils/utils';
import {selectDisplayLoginRequired, selectLoginRequiredDismissed} from '@shared/store/app/app.selectors';
import {setDisplayLoginRequired, setLoginRequiredDismissed} from '@shared/store/app/app.slice';
import useCountdownHook from '@shared/hooks/useCountdown';
import duration from 'dayjs/plugin/duration';
export interface ReLoginModalProps {
    type: 'header' | 'modal'
}
const ReLoginModal = ({type} : ReLoginModalProps) => {
    dayjs.extend(duration);
    const LOG_OUT_IN_MINUTES = 10 * 60; //10 Hours
    const DISPLAY_BEFORE_LOGOUT_IN_MINUTES = 30
    const {t} = useTranslation();
    const display = useSelector(selectDisplayLoginRequired);
    const dismissed = useSelector(selectLoginRequiredDismissed);
    const [timeLeft, setTimeLeft] = useState<string>();
    const [lastRunTime, setLastRunTime] = useState<Date>();
    const dispatch = useDispatch();
    const auth = useSelector(authenticationSelector);
    useCountdownHook(() => setLastRunTime(new Date()), 1);

    useEffect(() => {
        const displayAfter = dayjs(auth.firstLoginTime)
            .add((LOG_OUT_IN_MINUTES - DISPLAY_BEFORE_LOGOUT_IN_MINUTES) , 'minutes');
        if (dayjs().isAfter(displayAfter)) {
            if (!display) {
                dispatch(setDisplayLoginRequired(true));
            }
            const duration = dayjs.duration(dayjs(displayAfter)
                .add(DISPLAY_BEFORE_LOGOUT_IN_MINUTES, 'minutes')
                .diff(dayjs(), 'seconds') , 'seconds');
            if (duration.asSeconds() <= 0) {
                utils.logout().then();
            }
            setTimeLeft(duration.format('HH:mm:ss'));
        } else {
            if (display) {
                dispatch(setDisplayLoginRequired(false));
            }
        }
    }, [auth.firstLoginTime, lastRunTime, display]);

    const setDismissed = (value= true) => {
        dispatch(setLoginRequiredDismissed(value));
    }

    if (!display) {
        return null;
    }

    if (dismissed && type === 'header') {
        return <div className='flex flex-row pl-6 h-full items-center cursor-pointer' onClick={() => setDismissed(false)}>
            <div className='pr-2'>
                <SvgIcon type={Icon.Error} fillClass='warning-icon' />
            </div>
            <div className='flex flex-col'>
                <div className='subtitle3'>
                    {t('login.re-login_required_header')}
                </div>
                <div className='body2'>
                    {t('login.re-login_required_in', {time: timeLeft})}
                </div>
            </div>
        </div>
    }

    if (!dismissed && type === 'modal') {
        return <div className='w-full re-login-modal absolute z-10 bg-white right-6 mt-2'>
            <div className={classname('flex justify-between h-18 ')}>
                <h6 className='px-6 pb-2 pt-9'>
                    <div className='flex flex-row'>
                        <div className='pr-2'>
                            <SvgIcon type={Icon.Error} fillClass='warning-icon'/>
                        </div>
                        <div>
                            {t('login.re-login_required')}
                        </div>
                    </div>
                </h6>
                <div className='pt-4 pr-4 cursor-pointer' onClick={() => setDismissed()}>
                    <SvgIcon type={Icon.Close} className='icon-medium' fillClass='active-item-icon'/>
                </div>
            </div>
            <div>
                <div className=' px-6 flex flex-col pt-2'>
                    <div className='body2'>{t('login.will_be_logged_out_in')}</div>
                    <div className='pb-2'><h5>{timeLeft}</h5></div>
                    <div className='body2'>{t('login.session_duration')}</div>
                    <div className='flex flex-row py-6 space-x-6 justify-end pr-2'>
                        <Button label='login.dismiss_re-login' buttonType='secondary' onClick={() => setDismissed()}/>
                        <Button label='login.re-login_now' buttonType='small' onClick={() => utils.logout()}/>
                    </div>
                </div>
            </div>
        </div>
    }

    return null;

}

export default ReLoginModal;
