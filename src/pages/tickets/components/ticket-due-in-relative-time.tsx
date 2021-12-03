import {RelativeTime} from '@shared/utils/types';
import utils from '@shared/utils/utils';

interface DueInRelativeTimeProps {
    value?: RelativeTime;
    isOverdue?: boolean;
}

const DueInRelativeTime = ({value = [], isOverdue}: DueInRelativeTimeProps) => {
    const [days, hours, minute] = value;

    const className = isOverdue ? 'text-red-600' : 'body3-small';

    return (<span className={className}>
        {utils.formatRelativeTime(days, hours, minute, true) || ''}
    </span>)
}

export default DueInRelativeTime;
