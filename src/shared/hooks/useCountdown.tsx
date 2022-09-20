import {useEffect, useState} from "react";

const useCountdown = (onTimerEnd: () => void, seconds = 1) => {
    const [remainingSeconds, setRemainingSeconds] = useState<number>(seconds);
    useEffect(() => {
        let isMounted = true;
        const timeOut = setTimeout(() => {
            setRemainingSeconds((seconds) => seconds -1);
            if (remainingSeconds <= 0) {
                onTimerEnd();
            }
        }, 1000);
        return () => {
            clearTimeout(timeOut);
            isMounted = false;
        };
    }, [remainingSeconds]);

    return seconds;
};

export default useCountdown;
