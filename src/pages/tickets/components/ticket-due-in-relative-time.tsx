import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import {DAYJS_LOCALE} from '@pages/email/constants';

interface DueInRelativeTimeProps {
    value?: Date;
    isOverdue?: boolean;
}

const DueInRelativeTime = ({value, isOverdue}: DueInRelativeTimeProps) => {
    dayjs.extend(relativeTime);
    dayjs.extend(updateLocale);
    const className = isOverdue ? 'text-red-600' : 'body3-small';

    dayjs.updateLocale('en', DAYJS_LOCALE);
    return (<span className={className}>
        {value ? dayjs().to(dayjs.utc(value)) : ''}
    </span>)
}

export default DueInRelativeTime;
