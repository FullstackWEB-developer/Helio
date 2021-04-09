import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
const getWindowCenter = () => {
    const { width, height } = getWindowDimensions();
    return { x: width / 2, y: height / 2 };
}

const getWindowDimensions = () => {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height
    };
}

const formatDate = (datetime: string) => {
    const date = new Date(datetime);
    return date.toLocaleDateString('en-US');
}

const formatUtcDate = (date?: Date, format: string = 'ddd, MMM DD, YYYY h:mm A') =>  {
    dayjs.extend(utc);
    if (!date) {
        return '';
    }
    return dayjs.utc(date).local().format(format);
}

const formatDate12HoursTime = (date: string) => {
    return dayjs(date).format('MMM D, YYYY h:mm A')
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
const utils = {
    getWindowCenter, formatUtcDate, getWindowDimensions, formatDate, formatDate12HoursTime, formatDateShortMonth, getInitialsFromFullName, getDateTime
}

export default utils;
