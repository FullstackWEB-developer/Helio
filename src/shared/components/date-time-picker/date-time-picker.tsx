import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import useComponentVisibility from '@shared/hooks/useComponentVisibility';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import Calendar from '@components/calendar';
import utils from '@shared/utils/utils';
import {CalendarHorizontalAlign} from './calendar-align-enum';
import classNames from 'classnames';
import './date-time-picker.scss'; 
import utc from 'dayjs/plugin/utc';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

interface DateTimePickerProps {
    name?: string,
    label?: string;
    value?: Date;
    error?: string;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    max?: Date,
    min?: Date,
    type?: 'date' | 'time' | 'datetime';
    calendarHorizontalAlign?: CalendarHorizontalAlign;
    isWeekendDisabled?: boolean;
    calendarContainerClassName?: string;
    onChange?: (date: Date | undefined) => void;
    onBlur?: () => void;
    onCalendarVisibilityChange?: (isVisible: boolean) => void;
    onValidationError?: () => void;

}
const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(({
    label,
    value,
    type = 'datetime',
    name,
    min = new Date('0001-01-01T00:00:00'),
    max = new Date('9999-12-31T00:00:00'),
    calendarContainerClassName = '',
    isWeekendDisabled,
    calendarHorizontalAlign = CalendarHorizontalAlign.Right,
    onBlur,
    onValidationError,
    onCalendarVisibilityChange,
    ...props
}: DateTimePickerProps) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const {t}: {t: any} = useTranslation();
    const [inputValue, setInputValue] = useState(!value ? '' : utils.toShortISOLocalString(value));
    const [date, setDate] = useState(value);
    const [isCalendarOpen, setCalendarOpen, calendarWrapperRef] = useComponentVisibility<HTMLDivElement>(false)

    useEffect(() => {
        if (value) {
            setDate(value);
            setInputValue(utils.toShortISOLocalString(value));
        }

    }, [value])

    useEffect(() => {
        if (onCalendarVisibilityChange) {
            onCalendarVisibilityChange(isCalendarOpen);
        }
    }, [isCalendarOpen])

    const onChange = (dateValue?: Date) => {
        if (props.onChange) {
            props.onChange(dateValue);
        }
    }

    const isValidDate = (valueDate: Date) => valueDate >= min && valueDate <= max;

    const onInputValueChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = target.value;
        if (targetValue === '') {
            setInputValue(targetValue);
            setDate(undefined);
            onChange();
            return;
        }

        const dateValue = new Date(targetValue)
        if (!isValidDate(dateValue)) {
            setDate(undefined);
            if (onValidationError) {
                onValidationError();
            }
            return;
        }
        setInputValue(targetValue);
        setDate(dateValue);
        onChange(dateValue);
    }

    const onCalendarValueChange = (valueDate: string) => {
        const date = dayjs(valueDate, 'YYYY-MM-DD').utc(true).toDate();
        setInputValue(valueDate);
        onChange(date);
        setCalendarOpen(false);
    }

    const getLabelClassName = () => classNames('label-span', {
        'body2': !isCalendarOpen && !inputValue,
        'body3': isCalendarOpen || inputValue
    })

    const getAssistiveTextContainerClassName = () => classNames('h-6 max-h-6 pl-4 body3 pt-1 truncate', {'assistive-text-focus': isCalendarOpen});

    const getAssistiveTextClassName = () => classNames({
        'assistive-text-color-focused': isCalendarOpen,
        'assistive-text-color-inactive': !isCalendarOpen
    });

    const getInputClassName = () => classNames({
        'pt-2.5 h-10': !label,
        'input-pt h-14': label,
        'activated': !!inputValue,
        'error': !!props.error
    });

    const onCalendarWrapperClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        event.stopPropagation();
        event.preventDefault();
    }

    const onInputClick = (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        event.preventDefault();
        if (!isCalendarOpen) {
            setCalendarOpen(true);
        }
    }

    const onInputBlur = ({target}: React.FocusEvent<HTMLInputElement>) => {
        if (inputValue === '') {
            target.valueAsDate = null;
        }
        if (onBlur) {
            onBlur();
        }
    }

    const onClearClick = () => {
        setInputValue('');
        onChange();
    }

    return (
        <div ref={calendarWrapperRef} className={classNames('date-time-picker relative w-full flex flex-col h-20', calendarContainerClassName, {'date-time-picker-disabled': props.disabled})}>
            <div className={classNames('date-time-picker-container relative flex flex-wrap', {'open': isCalendarOpen})}>
                <input
                    name={name}
                    type='date'
                    onClick={onInputClick}
                    onChange={onInputValueChange}
                    onFocus={() => setCalendarOpen(true)}
                    onBlur={onInputBlur}
                    max={max ? utils.toShortISOLocalString(max) : undefined}
                    min={min ? utils.toShortISOLocalString(min) : undefined}
                    className={`w-px pl-4 body2 ${getInputClassName()} relative truncate flex-shrink flex-grow flex-auto leading-normal`}
                    value={inputValue}
                    disabled={props.disabled}
                />
                {label &&
                    <label className='absolute truncate'>
                        {props.required && !props.disabled &&
                            <span className='text-danger'>*</span>
                        }
                        <span className={getLabelClassName()}>{t(label)}</span>
                    </label>
                }
                {inputValue && isCalendarOpen &&
                    <div
                        role="button"
                        className={classNames('input-addon', {'pt-3': !label, 'pt-4': !!label})}
                        onClick={onClearClick}>
                        <SvgIcon type={Icon.Clear} fillClass='date-time-picker-clear' />
                    </div>
                }
                <div
                    role="button"
                    className={classNames('input-addon px-3', {'pt-3': !label, 'pt-4': !!label})}
                    onClick={() => setCalendarOpen(!isCalendarOpen)}
                    onMouseDown={(event) => event.preventDefault()}
                >
                    <SvgIcon type={isCalendarOpen ? Icon.ArrowUp : Icon.ArrowDown} fillClass='date-time-picker-arrow' />
                </div>
                {isCalendarOpen &&
                    <div
                        className={classNames('absolute top-14 z-20', {'right-0': calendarHorizontalAlign === CalendarHorizontalAlign.Left})}
                        onClick={onCalendarWrapperClick}
                    >
                        <Calendar
                            isWeekendDisabled={isWeekendDisabled}
                            onBlur={onBlur}
                            date={date}
                            max={max}
                            min={min}
                            onChange={onCalendarValueChange} />
                    </div>
                }
            </div>
            {props.assistiveText && !props.error &&
                <div className={getAssistiveTextContainerClassName()}>
                    <span className={getAssistiveTextClassName()}>{props.assistiveText}</span>
                </div>
            }
            {props.error &&
                <div className='h6 pl-4 body3 pt-1 text-danger truncate'>{props.error}</div>
            }
        </div>
    );
});


export default DateTimePicker;
