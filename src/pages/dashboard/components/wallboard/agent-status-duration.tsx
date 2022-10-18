import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {useEffect, useState} from 'react';
import {LiveAgentStatusInfo} from '@shared/models';

const AgentStatusDuration = ({record}: {record: LiveAgentStatusInfo}) => {
    dayjs.extend(duration);
    const [timePassed, setTimePassed] = useState<number>(0);
    const [date, setDate] = useState<Date>();

    useEffect(() => {
        let minDate = record.timestamp;
        if (record.calls && record.calls.length > 0) {
            if (dayjs(minDate).isAfter(dayjs(record.calls[0].timestamp))) {
                minDate = record.calls[0].timestamp;
            }
        }
        if (record.chats && record.chats.length > 0) {
            record.chats.forEach(chat => {
                if (dayjs(minDate).isAfter(dayjs(chat.timestamp))) {
                    minDate = chat.timestamp;
                }
            })
        }
        setDate(minDate);
    }, [record]);

    useEffect(() => {
        let isMounted = true;
        let interval = setInterval(() => {
            if (isMounted) {
                let seconds = dayjs(new Date()).diff(dayjs(date), 'second');
                setTimePassed(seconds >= 0 ? seconds : 0);
            }
        }, 1000);

        return () => {
            isMounted = false;
            clearInterval(interval)
        };
    }, [date]);

    return <div> {Math.floor(dayjs.duration(timePassed, 'seconds').asHours())}{dayjs.duration(timePassed, 'seconds').format(':mm:ss')}</div>
}

export default AgentStatusDuration;
