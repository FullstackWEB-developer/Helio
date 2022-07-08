import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

interface DueInRelativeTimeProps {
    value?: Date;
    isOverdue?: boolean;
}

const DueInRelativeTime = ({value, isOverdue}: DueInRelativeTimeProps) => {
    dayjs.extend(relativeTime);
    dayjs.extend(updateLocale);
    const className = isOverdue ? 'text-red-600' : 'body3-small';

    dayjs.updateLocale('en', {
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            m: "1 min",
            mm: "%d mins",
            h: "1 h",
            hh: "%d h",
            d: "1 d",
            dd: "%d d",
            M: "1 mo",
            MM: "%d mo",
            y: "1 y",
            yy: "%d y"
        }
    })
    return (<span className={className}>
        {value ? dayjs().to(dayjs.utc(value)) : ''}
    </span>)
}

export default DueInRelativeTime;
