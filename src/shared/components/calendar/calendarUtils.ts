import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import {DateDetail} from './date-detail.type';

dayjs.extend(localeData);

const getOffsetMonth = (firstDayCalendar: number, numberOfDays: number): number => {
    if (firstDayCalendar < 0) {
        return -1;
    }
    return firstDayCalendar >= numberOfDays ? 1 : 0;
}

const getDayDetails = (index: number, numberOfDays: number, firstDay: number, year: number, month: number): DateDetail => {
    const date = index - firstDay;
    const day = index % 7;
    let prevMonth = month - 1;
    let prevYear = year;
    if (prevMonth < 0) {
        prevMonth = 11;
        prevYear--;
    }

    const prevMonthNumberOfDays = dayjs(new Date(prevYear, prevMonth)).daysInMonth();
    const _date = (date < 0 ? prevMonthNumberOfDays + date : date % numberOfDays) + 1;
    const offsetMonth = getOffsetMonth(date, numberOfDays);
    const currentMonth = month + offsetMonth;
    const currentDate = new Date(year, currentMonth, _date);
    const timestamp = currentDate.getTime();
    return {
        day: _date,
        dayOfWeek: day,
        monthIndex: currentMonth,
        date: currentDate,
        isCurrentMonth: offsetMonth === 0,
        isWeekend: currentDate.getDay() % 6 === 0,
        timestamp
    }
}

export const getMonthDetails = (date: dayjs.Dayjs): DateDetail[] => {
    const year = date.year();
    const month = date.month();
    const firstDay = (new Date(year, month)).getDay();
    const numberOfDays = date.daysInMonth();
    const monthArray : DateDetail[] = [];
    const rows = 6;
    const cols = 7;

    let index = 0;
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const currentDay = getDayDetails(
                index,
                numberOfDays,
                firstDay,
                year,
                month
            );
            monthArray.push(currentDay);
            index++;
        }
    }
    return monthArray;
}

export const getTodayTimestamp = () => new Date(new Date().setHours(0, 0, 0, 0)).getTime();
