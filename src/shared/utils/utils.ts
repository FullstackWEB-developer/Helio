import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import {RelativeTime} from './types';

const getWindowCenter = () => {
    const {width, height} = getWindowDimensions();
    return {x: width / 2, y: height / 2};
}

const getWindowDimensions = () => {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

const formatPhone = (phone: string) => {
    if (!phone) {
        return '';
    }
    phone = phone.replaceAll('-', '');
    if (phone && phone.length >= 10) {

        return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, phone.length)}`;
    } else {
        return phone;
    }
};

const clearFormatPhone = (phone: string) => {
    if (!phone) {
        return '';
    }
    return phone.replace(/[^\d]/g, '')
}

const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US');
}


const formatUtcDate = (date?: Date, format: string = 'ddd, MMM DD, YYYY h:mm A') => {
    dayjs.extend(utc);
    if (!date) {
        return '';
    }
    return dayjs.utc(date).local().format(format);
}

const formatDateShortMonth = (date: string) => {
    return dayjs(date).format('MMM D, YYYY');
}

const getInitialsFromFullName = (username: string): string => {
    const names = username.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
}

const getDateTime = (dueDate?: Date, dueTime?: string) => {
    let dateTime;
    if (dueDate && dueTime) {
        const hours = parseInt(dueTime.split(':')[0]);
        const minutes = parseInt(dueTime.split(':')[1]);
        dateTime = dayjs.utc(dueDate).local().hour(hours).minute(minutes);
    } else if (dueDate) {
        dateTime = dayjs.utc(dueDate).local();
    } else if (dueTime) {
        const hours = parseInt(dueTime.split(':')[0]);
        const minutes = parseInt(dueTime.split(':')[1]);
        dateTime = dayjs.utc().local().hour(hours).minute(minutes);
    }
    return dateTime;
}



const formatRelativeTime = (days?: number, hours?: number, minutes?: number, abs = false, minutesFormat = 'm'): string => {
    const getTimePart = (timePart: number) => abs ? Math.abs(timePart) : timePart;

    if (days && days !== 0) {
        return `${getTimePart(days)} d ${getTimePart(hours ?? 0)} h`;
    }

    if (hours && hours !== 0) {
        return `${getTimePart(hours)} h ${getTimePart(minutes ?? 0)} ${minutesFormat}`;
    }

    if (minutes) {
        return `${getTimePart(minutes)} ${minutesFormat}`;
    }

    return '';
}

const getRelativeTime = (date?: Date): RelativeTime => {
    if (!date) {
        return [];
    }

    let totalMinutes = dayjs.utc(date).diff(dayjs(), 'minute');
    const isNegative = totalMinutes < 0;
    const totalDays = Math.floor(Math.abs(totalMinutes) / (24 * 60));
    totalMinutes = totalMinutes - ((isNegative ? (-1 * totalDays) : totalDays) * (24 * 60));

    const totalHours = Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes - (totalHours * 60);

    return [totalDays, totalHours, totalMinutes]
}

const isString = (obj: any) => {
    return typeof obj === 'string' || obj instanceof String;
}

const toShortISOLocalString = (date?: Date) => {
    if (!date) {
        return '';
    }
    dayjs.extend(utc);
    const dateDayJs = dayjs(date).utc().local();
    return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DD')}`;
}


const toISOLocalString = (date?: Date) => {
    if (!date) {
        return '';
    }
    dayjs.extend(utc);
    const dateDayJs = dayjs(date).utc().local();
    return `${dateDayJs.format('YYYY').padStart(4, '0')}-${dateDayJs.format('MM-DDTHH:mm:ss.SSS[Z]')}`;
}

const stringJoin = (separator: string, ...params: Array<string | undefined>) => params.join(separator);

const utils = {
    getWindowCenter,
    formatUtcDate,
    getWindowDimensions,
    formatDate,
    formatDateShortMonth,
    getInitialsFromFullName,
    getDateTime,
    getRelativeTime,
    formatRelativeTime,
    formatPhone,
    clearFormatPhone,
    isString,
    toShortISOLocalString,
    toISOLocalString,
    stringJoin,
};

export default utils;