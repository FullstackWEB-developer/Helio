import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
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

const formatRelativeTime = (days?: number, hours?: number, minutes?: number, abs: boolean= false): string => {
    const getTimePart = (timePart: number) => abs ? Math.abs(timePart) : timePart;
   
    if (days && days !== 0) {
        return `${getTimePart(days)} d ${getTimePart(hours ?? 0)} h`;
    }

    if (hours && hours !== 0) {
        return `${getTimePart(hours)} h ${getTimePart(minutes ?? 0)} m`;
    }
     
    if (minutes) {
        return `${getTimePart(minutes)} m`;
    }

    return '';
}

const getRelativeTime = (date?: Date): [number, number, number] | [] => {
    if (!date) {
        return [];
    }

    let totalMinutes = dayjs(date).diff(dayjs(), 'minute');
    const totalDays = Math.floor(totalMinutes / (24 * 60));
    totalMinutes = totalMinutes - (totalDays * (24 * 60));

    const totalHours = Math.floor(totalMinutes / 60);
    totalMinutes = totalMinutes - (totalHours * 60);

    return [totalDays, totalHours, totalMinutes]

}
const utils = {
    getWindowCenter,
    formatUtcDate,
    getWindowDimensions,
    formatDate,
    formatDate12HoursTime,
    formatDateShortMonth,
    getInitialsFromFullName,
    getDateTime,
    getRelativeTime,
    formatRelativeTime
}

export default utils;
