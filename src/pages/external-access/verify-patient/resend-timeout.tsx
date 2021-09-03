import {useTranslation} from 'react-i18next';
import {useEffect, useState} from 'react';

export interface ResendTimeoutProps {
    countdownSeconds: number,
    onTimeOut?: () => void;
    message: string;
}
export const ResendTimeout =({onTimeOut, countdownSeconds, message}: ResendTimeoutProps) => {
    const {t} = useTranslation();
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        if (seconds == 0 && countdownSeconds > 0) {
            setSeconds(countdownSeconds);
        }
    }, [countdownSeconds])

    useEffect(() => {
        let isMounted = true;
        setTimeout(() => {
            if (isMounted && countdownSeconds > 0) {
                setSeconds((second) => second - 1);
                if (seconds <= 0) {
                    if (onTimeOut) {
                        onTimeOut();
                    }
                }
            }
        }, 1000);

        return () => {
            isMounted = false;
        };
    }, [seconds]);

    return seconds >  0 ? <div className='body2-medium'>{t(message, {timeLeft: seconds})}</div> : null
}
