import utils from '@shared/utils/utils';

interface DueInRelativeTimeProps {
    date?: Date
}

const DueInRelativeTime = ({date}: DueInRelativeTimeProps) => {
    const relativeTime = utils.getRelativeTime(date);
    const [days, hours, minute] = relativeTime;

    const className = relativeTime.some(timePart => timePart && timePart < 0) ? 'text-red-600' : 'body2-medium';

    return (<span className={className}>
        {utils.formatRelativeTime(days, hours, minute, true) || '-'}
    </span>)
}

export default DueInRelativeTime;
