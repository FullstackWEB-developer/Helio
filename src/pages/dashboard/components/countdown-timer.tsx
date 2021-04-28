import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

export interface CountdownTimerProps {
    onTimerEnd: () => void;
    isLoading: boolean
}

const CountdownTimer = ({onTimerEnd, isLoading}: CountdownTimerProps) => {
    dayjs.extend(duration);
    const refreshInterval = 3 * 60;
    const {t} = useTranslation();
    const [leftSeconds, setLeftSeconds] = useState<number>(refreshInterval);

    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            if (isMounted) {
                setLeftSeconds(leftSeconds - 1);
                if (leftSeconds <= 0) {
                    setLeftSeconds(refreshInterval);
                    onTimerEnd();
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
        };
    });

    const getTimeLeft = () => {
        const duration = dayjs.duration(leftSeconds, 'seconds');
        return duration.format('mm:ss')
    }

    if (isLoading) {
        return <div className='h-8 flex justify-end w-20'>
            <ThreeDotsSmallLoader className="three-dots-loader-small" cx={13} cxSpace={23} cy={16}/>
        </div>
    }
    return <div className='body2-medium'>{t('dashboard.refresh_after', {time: getTimeLeft()})}</div>
}

export default CountdownTimer;
