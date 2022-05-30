import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {useEffect, useState} from 'react';

const AgentStatusDuration = ({date}: {date: Date}) => {
    dayjs.extend(duration);
    const [timePassed, setTimePassed] = useState<number>(0)

    useEffect(() => {
        let isMounted = true;
        let interval = setInterval(() => {
            if (isMounted) {
                setTimePassed(dayjs(new Date()).diff(dayjs(date), 'second'));
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(interval)
        };
    }, [date]);

    return <div> {dayjs.duration(timePassed, 'seconds').asHours().toFixed()}{dayjs.duration(timePassed, 'seconds').format(':mm:ss')}</div>
}

export default AgentStatusDuration;
