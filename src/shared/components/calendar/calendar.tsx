import {useEffect, useState} from "react";
import SvgIcon from "../svg-icon/svg-icon";
import {Icon} from '../svg-icon/icon';
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
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
    isSmallSize?:boolean,
    onChange?: (date: string) => void;
    onBlur?: () => void;
    onFocus?: () => void;
}
const Calendar = ({
    date,
    highlightToday,
    min = new Date(1900, 0, 1),
    max = new Date(9999, 11, 12),
    isWeekendDisabled = false,
    isSmallSize = false,
    onChange,
    onBlur,
    onFocus
}: CalendarProps) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const [currentDate, setCurrentDate] = useState(dayjs(date));
    const [monthDetail, setMonthDetail] = useState<DateDetail[]>([]);
    const [selectedDay, setSelectedDay] = useState<number | undefined>();
    const [isDisabledForward, setDisabledForward] = useState(false);
    const [isDisabledBackward, setDisabledBackward] = useState(false);

    useEffect(() => {
        const reEvaluateNavigationEnabled = (valueDate: dayjs.Dayjs) => {
            if (min) {
                const valueMin = valueDate.set('date', min.getDate()).set('hour', min.getHours()).set('minute', min.getMinutes()).set('second', min.getSeconds()).toDate();
                setDisabledBackward(valueMin < min || valueMin.toDateString() == min?.toDateString());
            }
            if (max) {
                const valueMax = valueDate.set('date', max.getDate()).set('hour', max.getHours()).set('minute', max.getMinutes()).set('second', max.getSeconds()).toDate();
                setDisabledForward(valueMax > max || valueMax.toDateString() == max?.toDateString());
            }

        }

        const days = getMonthDetails(currentDate);
        setMonthDetail(days);
        reEvaluateNavigationEnabled(currentDate);
    }, [currentDate, max, min])

    useEffect(() => {
        setCurrentDate(dayjs(date));
        if (date) {
            const dateTimeLocal = dayjs(date).utc().local().startOf('hour');
            const dateMs = new Date(dateTimeLocal.year(), dateTimeLocal.month(), dateTimeLocal.date()).getTime();
            setSelectedDay(dateMs);
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
            onChange(dayjs(day.date).utc().local().format('YYYY-MM-DD'));
        }
    }

    const getSizedClassName = (smallClassNames: string, responsiveClassNames: string) => {
        if(isSmallSize){
            return smallClassNames
        }else{
            return responsiveClassNames
        }
    }

    return (<div tabIndex={0}  className={`px-4 pb-4 pt-6 overflow-hidden ${getSizedClassName('small-calendar','calendar xl:px-7 xl:pb-7 xl:pt-10')}`} onBlur={onBlur} onFocus={onFocus}>
        <div className='calendar-container'>
            <div className='flex flex-row items-center justify-between'>
                <div role='button' className='cursor-pointer' onClick={() => !isDisabledBackward && goBackward('month')}>
                    <SvgIcon type={Icon.ArrowLeft} fillClass={isDisabledBackward ? 'arrow-disabled' : ''} />
                </div>
                <div>
                    <span className='subtitle'>{currentDate.format('MMMM YYYY')}</span>
                </div>
                <div role='button' className='cursor-pointer' onClick={() => !isDisabledForward && goForward('month')}>
                    <SvgIcon type={Icon.ArrowRight} fillClass={isDisabledForward ? 'arrow-disabled' : ''} />
                </div>
            </div>
            <div className={`w-full mt-4 ${getSizedClassName('','xl:mt-5')}`}>
                <div className={`grid grid-cols-7 items-center justify-items-center subtitle2 ${getSizedClassName('','xl:gap-x-6')}`}>
                    {dayjs.weekdaysMin().map((d, i) => <div key={i} className='items-center'>{d.charAt(0)}</div>)}
                </div>
                <div className={`grid grid-cols-7 items-center justify-items-center ${getSizedClassName('','xl:gap-x-6 xl:gap-y-1.5 xl:pt-7')}`}>
                    {monthDetail &&
                        monthDetail.map((dateDetail, index) => (
                            <div key={index}>
                                {dateDetail.isCurrentMonth &&
                                    <div role="button" onClick={() => !isDisabled(dateDetail) && onDayClick(dateDetail)}
                                        className={`${getClassName(dateDetail)} ${getSizedClassName('small-calendar-day-container','calendar-day-container')} flex items-center justify-center body2`}>
                                        <span className={classNames({'weekend': dateDetail.isWeekend})}>{dateDetail.day}</span>
                                    </div>
                                }
                            </div>)
                        )
                    }
                </div>
            </div>
        </div>
    </div >)
};

export default Calendar;
