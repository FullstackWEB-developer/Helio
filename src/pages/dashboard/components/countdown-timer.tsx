import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';

export interface CountdownTimerProps {
    onTimerEnd: () => void;
    isLoading: boolean
}

const CountdownTimer = ({onTimerEnd, isLoading}: CountdownTimerProps) => {
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

    if (isLoading) {
        return <div className='h-8 flex justify-end w-20'>
            <ThreeDotsSmallLoader className="three-dots-loader-small" cx={13} cxSpace={23} cy={16}/>
        </div>
    }
    return <div className='body2-medium'>{t('dashboard.refresh_after', {time: leftSeconds})}</div>
}

export default CountdownTimer;
