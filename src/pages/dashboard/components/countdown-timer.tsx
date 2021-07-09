import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {DashboardTypes} from '@pages/dashboard/enums/dashboard-type.enum';
import classnames from 'classnames';
import Spinner from '@components/spinner/Spinner';

export interface CountdownTimerProps {
    onTimerEnd: () => void;
    isLoading: boolean,
    type: DashboardTypes
}

const CountdownTimer = ({onTimerEnd, isLoading, type}: CountdownTimerProps) => {
    dayjs.extend(duration);
    const WallboardRefreshIntervalInMinutes = 1;
    const DashboardRefreshIntervalInMinutes = 3;
    const {t} = useTranslation();
    const [interval, setInterval] = useState<number>(DashboardRefreshIntervalInMinutes * 60);
    const [leftSeconds, setLeftSeconds] = useState<number>(interval);
    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            if (isMounted) {
                setLeftSeconds(leftSeconds - 1);
                if (leftSeconds <= 0) {
                    setLeftSeconds(interval);
                    onTimerEnd();
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
        };
    });

    useEffect(() => {
        const newInterval = type === DashboardTypes.wallboard ? WallboardRefreshIntervalInMinutes * 60 : DashboardRefreshIntervalInMinutes * 60;
        setInterval(newInterval);
        setLeftSeconds(newInterval);
    }, [type]);

    const getTimeLeft = () => {
        const duration = dayjs.duration(leftSeconds, 'seconds');
        return duration.format('mm:ss')
    }

    if (isLoading) {
        return <div className='h-8 flex justify-end w-20'>
            <Spinner size='small'/>
        </div>
    }
    const messageClass = classnames('body2-medium', {
        'pt-8': type === DashboardTypes.wallboard
    });
    return <div className={messageClass}>{t(`${type === DashboardTypes.wallboard ? 'wallboard' : 'dashboard'}.refresh_after`, {time: getTimeLeft()})}</div>
}

export default CountdownTimer;
