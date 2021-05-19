import {useEffect, useState} from "react";
import SvgIcon from "../svg-icon/svg-icon";
import {Icon} from '../svg-icon/icon';
import dayjs from 'dayjs';
import {DateDetail} from './date-detail.type';
import {getMonthDetails, getTodayTimestamp} from './calendarUtils';
import classNames from 'classnames';
import './calendar.scss';

interface CalendarProps {
    date?: Date,
    max?: Date,
    min?: Date,
    isWeekendDisabled?: boolean,
    highlightToday?: boolean,
    onChange?: (date: Date) => void;
    onBlur?: () => void;
}
const Calendar = ({
    date,
    highlightToday,
    min = new Date(1900, 0, 1),
    max = new Date(9999, 11, 12),
    isWeekendDisabled = false,
    onChange,
    onBlur
}: CalendarProps) => {
    const [currentDate, setCurrentDate] = useState(dayjs(date));
    const [monthDetail, setMonthDetail] = useState<DateDetail[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | undefined>();
    const [isDisabledForward, setDisabledForward] = useState(false);
    const [isDisabledBackward, setDisabledBackward] = useState(false);

    useEffect(() => {
        const reEvaluateNavigationEnabled = (valueDate: dayjs.Dayjs) => {
            const valueMax = valueDate.set('date', max.getDate()).toDate();
            const valueMin = valueDate.set('date', min.getDate()).toDate();
            setDisabledForward(valueMax >= max);
            setDisabledBackward(valueMin <= min);
        }

        const days = getMonthDetails(currentDate);
        setMonthDetail(days);
        reEvaluateNavigationEnabled(currentDate);
    }, [currentDate, max, min])

    useEffect(() => {
        setCurrentDate(dayjs(date));
        if (date) {
            const dateUTCWithoutTime = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
            setSelectedDay(dateUTCWithoutTime.getTime());
        }
    }, [date]);

    const isCurrentDay = (day: DateDetail) => day.timestamp === getTodayTimestamp();
    const isSelectedDay = (day: DateDetail) => selectedDay && day.timestamp === selectedDay;
    const isValidDate = (value: Date) => value >= min && value <= max;
    const isDisabled = (day: DateDetail) => (day.isWeekend && isWeekendDisabled) || !day.isCurrentMonth || !isValidDate(day.date);

    const moveDate = (value: number, direction: 'backward' | 'forward', dateUnit: dayjs.OpUnitType) => {
        return direction === "forward" ? currentDate.add(value, dateUnit) : currentDate.subtract(value, dateUnit);
    }

    const dateNavigate = (value: number, direction: 'backward' | 'forward', dateUnit: dayjs.OpUnitType): void => {
        const newDate = moveDate(value, direction, dateUnit);
        setCurrentDate(newDate);
    }

    const goForward = (dateUnit: dayjs.OpUnitType) => dateNavigate(1, 'forward', dateUnit);
    const goBackward = (dateUnit: dayjs.OpUnitType) => dateNavigate(1, 'backward', dateUnit);

    const getClassName = (day: DateDetail) => classNames({
        'disabled': isDisabled(day),
        'highlight-today': highlightToday && isCurrentDay(day),
        'highlight-selected': isSelectedDay(day),
        'weekend': day.isWeekend
    });

    const onDayClick = (day: DateDetail) => {
        if (currentDate.month() !== day.monthIndex) {
            return;
        }
        setSelectedDay(day.timestamp);
        if (onChange) {
            onChange(new Date(day.timestamp));
        }
    }

    return (<div className='calendar px-7 pb-7 pt-10 overflow-hidden' onBlur={(e) => onBlur}>
        <div className='calendar-container'>
            <div className='flex flex-row items-center justify-between'>
                <div role='button' className='cursor-pointer' onClick={() => !isDisabledBackward && goBackward('month')}>
                    <SvgIcon type={Icon.ArrowLeft} fillClass={isDisabledBackward ? 'arrow-disabled' : ''} />
                </div>
                <div>
                    <span className='h5-regular'>{currentDate.format('MMMM YYYY')}</span>
                </div>
                <div role='button' className='cursor-pointer' onClick={() => !isDisabledForward && goForward('month')}>
                    <SvgIcon type={Icon.ArrowRight} fillClass={isDisabledForward ? 'arrow-disabled' : ''} />
                </div>
            </div>
            <div className='w-full mt-5'>
                <div className='grid grid-cols-7 gap-x-6 items-center justify-items-center subtitle2'>
                    {dayjs.weekdaysMin().map((d, i) => <div key={i} className='items-center'>{d.charAt(0)}</div>)}
                </div>
                <div className='grid grid-cols-7 gap-x-6 gap-y-1.5 items-center justify-items-center pt-7'>
                    {monthDetail &&
                        monthDetail.map((dateDetail, index) => (
                            <div key={index}>
                                <div onClick={() => !isDisabled(dateDetail) && onDayClick(dateDetail)}
                                    className={`${getClassName(dateDetail)} calendar-day-container flex items-center justify-center body2`}>
                                    <span className={classNames({'weekend': dateDetail.isWeekend})}>{dateDetail.isCurrentMonth ? dateDetail.day : ''}</span>
                                </div>
                            </div>)
                        )
                    }
                </div>
            </div>
        </div>
    </div >)
};

export default Calendar;
