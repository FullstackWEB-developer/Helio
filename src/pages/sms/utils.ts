import dayjs from 'dayjs';
import {Paging, TicketMessage} from '@shared/models';
import utils from '@shared/utils/utils';
import utc from 'dayjs/plugin/utc';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';
import {TicketLookupValue} from '@pages/tickets/models/ticket-lookup-values.model';
import {Option} from '@components/option/option';
import {UseQueryResult} from 'react-query';
dayjs.extend(utc);

export const MAX_MESSAGE_SUMMARY_BODY_LENGTH = 50;

export const messageSummaryTruncate = (value: string) => {
    return value.length > MAX_MESSAGE_SUMMARY_BODY_LENGTH ? `${value.substr(0, MAX_MESSAGE_SUMMARY_BODY_LENGTH)}...` : value;
}

export const messageRelativeTimeFormat = (value: dayjs.Dayjs): string => {
    const days = value.diff(dayjs().startOf('d'), 'd');
    if (days >= -1) {
        var time = new Intl.RelativeTimeFormat('en', {numeric: "auto"});
        return time.format(days, 'day');
    }
    return value.format('MMM DD YYYY');
}

export const ticketListRelativeTimeFormat = (suffix: string, value?: Date) => {
    if (!value) {
        return '-';
    }
    dayjs.extend(utc);
    const valueDayJs = dayjs.utc(value);
    const days = dayjs().diff(valueDayJs, 'd');
    if (days > 0) {
        return valueDayJs.format('MMMM DD[,] YYYY hh:mm A');
    } else {
        const [day, hours, minute] = utils.getRelativeTime(value);
        return `${utils.formatRelativeTime(day, hours, minute, true)} ${suffix}`;
    }
}

export const messageSort = (messages: TicketMessage[]) => {
    return messages.sort((a, b) => dayjs.utc(a.createdOn).valueOf() - dayjs.utc(b.createdOn).valueOf());
}


export const getOptions = (data?: TicketEnumValue[]): Option[] => {
    if (!data) {
        return [];
    }
    return data.map(item => ({
        value: item.key.toString(),
        label: item.value,
        object: item
    }));
}
export const getReasonOption = (data?: TicketLookupValue[], selectedTicketType?: Option) => {
    if (data && selectedTicketType) {
        return data.filter(v => v.parentValue === selectedTicketType.value)
            .map(item => ({
                value: item.value,
                label: item.label,
                object: item
            }));
    }
    return [];
}

export const getNextPage = (paged: Paging) => {
    return paged.page < paged.totalPages ? paged.page + 1 : undefined
}

export const aggregateQueries = <T extends unknown>(queries: UseQueryResult[]) => {
    if (queries.length < 1) {
        return {data: [], error: undefined, isFetching: false, isSuccess: false};
    }

    const error = queries.find(q => q.error)?.error;
    const isError = queries.some(q => q.isError);
    const isFetching = queries.some(q => q.isFetching);
    const data = !error && !isFetching ? queries.map(q => q.data) as T[] : [];
    const isSuccess = queries.every(p => p.isFetched && !p.isFetching && p.isSuccess)

    return {data: data, error: error, isError: isError, isFetching: isFetching, isSuccess};
}

