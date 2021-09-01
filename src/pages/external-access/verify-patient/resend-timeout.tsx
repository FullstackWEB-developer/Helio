import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';

export interface ResendTimeoutProps {
    isStarted: boolean,
    onTimeOut: () => void;
}
export const ResendTimeout =({onTimeOut, isStarted}: ResendTimeoutProps) => {
    const {t} = useTranslation();
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        if (isStarted) {
            setSeconds(60);
        }
    }, [isStarted])

    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            if (isMounted) {
                setSeconds((second) => second - 1);
                if (seconds <= 0) {
                    onTimeOut();
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
        };
    }, [seconds]);

    return seconds >  0 ? <div className='body2-medium'>{t('external_access.resend_in_seconds', {'timeLeft': seconds})}</div> : null
}
