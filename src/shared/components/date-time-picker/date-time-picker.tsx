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
import {InputType} from '@shared/models/input.types';
import {DATE_ISO_FORMAT, DATE_INPUT_LONG_FORMAT} from '@shared/constants/form-constants';
import {getElementPosition, getScrollParent} from './date-time-picker-utils';
interface DateTimePickerProps {
    name?: string;
    label?: string;
    value?: Date;
    error?: string;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    longDateFormat?: boolean;
    max?: Date;
    min?: Date;
    type?: InputType;
    calendarHorizontalAlign?: CalendarHorizontalAlign;
    isWeekendDisabled?: boolean;
    calendarContainerClassName?: string;
    isCalendarPositionComputed?: boolean;
    onChange?: (date: Date | undefined) => void;
    onBlur?: () => void;
    onCalendarVisibilityChange?: (isVisible: boolean) => void;
    onValidationError?: () => void;
    onPressEnter?: () => void;
}
const DateTimePicker = React.forwardRef<HTMLInputElement, DateTimePickerProps>(({
    label,
    value,
    type = 'datetime',
    name,
    min = new Date('0001-01-01T00:00:00'),
    max = new Date('9999-12-31T00:00:00'),
    calendarContainerClassName = '',
    isWeekendDisabled,
    calendarHorizontalAlign = CalendarHorizontalAlign.Right,
    longDateFormat = false,
    isCalendarPositionComputed = false,
    onBlur,
    onValidationError,
    onPressEnter,
    onCalendarVisibilityChange,
    ...props
}: DateTimePickerProps, ref) => {
    dayjs.extend(customParseFormat);
    dayjs.extend(utc);
    const {t}: {t: any} = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [date, setDate] = useState(value);
    const [isCalendarOpen, setCalendarOpen, calendarWrapperRef] = useComponentVisibility<HTMLDivElement>(false);
    const [inputDateFormat, setInputDateFormat] = useState(DATE_ISO_FORMAT);
    const [isInputReadOnly, setInputReadOnly] = useState(false);
    const [inputType, setInputType] = useState<InputType>('date');
    const [isISOFormat, setIsISOFormat] = useState(!longDateFormat);
    const [calendarPositionTop, setCalendarPositionTop] = useState(0)

    const switchDateFormat = (isISOFormatEnabled: boolean) => {
        if (isISOFormatEnabled) {
            setInputDateFormat(DATE_ISO_FORMAT);
            setInputReadOnly(false);
            setInputType('date');
        } else {
            setInputDateFormat(DATE_INPUT_LONG_FORMAT);
            setInputReadOnly(true);
            setInputType('text');
        }
    }

    useEffect(() => {
        switchDateFormat(isISOFormat);
    }, [isISOFormat]);

    useEffect(() => {
        if (value) {
            setDate(value);
            if (isISOFormat) {
                setInputValue(utils.toShortISOLocalString(value));
            } else {
                setInputValue(dayjs(value).utc().local().format(DATE_INPUT_LONG_FORMAT));
            }
        }
    }, [value, isISOFormat])

    useEffect(() => {
        if (onCalendarVisibilityChange) {
            onCalendarVisibilityChange(isCalendarOpen);
        }
    }, [isCalendarOpen, onCalendarVisibilityChange])

    useEffect(() => {
        const empty = () => undefined;
        if (!isCalendarPositionComputed) {
            return empty;
        }

        const inputElementRef = (ref as React.MutableRefObject<HTMLButtonElement>).current;

        if (!inputElementRef) {
            return empty;
        }

        const calcCalendarPosition = () => {
            const position = getElementPosition(inputElementRef);
            setCalendarPositionTop(position.top + inputElementRef.offsetHeight);
        }

        calcCalendarPosition();
        const parent = getScrollParent(inputElementRef) as HTMLElement;
        if (!parent) {
            return empty;
        }


        parent.addEventListener('scroll', calcCalendarPosition);
        return () => {
            parent.removeEventListener('scroll', calcCalendarPosition);
        }

    }, [isCalendarPositionComputed, ref]);

    const onChange = (dateValue?: Date) => {
        if (props.onChange) {
            props.onChange(dateValue);
        }
    }

    const isValidDate = (valueDate: Date) => valueDate >= min && valueDate <= max;

    const onInputValueChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = target.value;
        if (targetValue === '' || !target.valueAsDate) {
            setInputValue(targetValue);
            setDate(undefined);
            onChange();
            return;
        }
        const dateValue = dayjs(new Date(`${targetValue}T00:00:00`)).utc().local().toDate();

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
        const dateDayJs = dayjs(valueDate, DATE_ISO_FORMAT).utc().local();
        const newDate = dateDayJs.toDate();
        const newInputValue = dateDayJs.format(inputDateFormat);
        setInputValue(newInputValue);
        onChange(newDate);
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

    const getCalendarWrapper = () =>
        classNames('date-time-picker w-full flex flex-col h-20',
            calendarContainerClassName,
            {
                'date-time-picker-disabled': props.disabled,
                'relative': !isCalendarPositionComputed
            }
        );

    const getInputClassName = () =>
        classNames('relative truncate flex-shrink flex-grow flex-auto leading-normal w-px pl-4 body2', {
            'pt-2.5 h-10': !label,
            'input-pt h-14': label,
            'activated': !!inputValue,
            'error': !!props.error,
            'cursor-pointer': longDateFormat
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
    const onInputFocus = () => {
        setCalendarOpen(true);
        if (longDateFormat) {
            setIsISOFormat(true);
        }
    }
    const onInputBlur = ({target}: React.FocusEvent<HTMLInputElement>) => {
        if (inputValue === '' && inputType === 'date') {
            target.valueAsDate = null;
        }
        if (onBlur) {
            onBlur();
        }
        if (longDateFormat) {
            setIsISOFormat(false);
        }
    }

    const onCalendarBlur = () => {
        if (onBlur) {
            onBlur();
        }
        setCalendarOpen(false);
    }

    const onInputPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== 'Enter') {
            return;
        }
        setCalendarOpen(false);
        if (onPressEnter) {
            onPressEnter();
        }
    }

    const onClearClick = () => {
        setInputValue('');
        onChange();
    }



    return (
        <div ref={calendarWrapperRef} className={getCalendarWrapper()}>
            <div className={classNames('date-time-picker-container flex flex-wrap relative', {'open': isCalendarOpen})}>
                <input
                    ref={ref}
                    name={name}
                    type={inputType}
                    onClick={onInputClick}
                    onChange={onInputValueChange}
                    onFocus={onInputFocus}
                    onBlur={onInputBlur}
                    onKeyPress={onInputPress}
                    max={max ? utils.toShortISOLocalString(max) : undefined}
                    min={min ? utils.toShortISOLocalString(min) : undefined}
                    className={getInputClassName()}
                    value={inputValue}
                    readOnly={isInputReadOnly}
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

            </div>
            {isCalendarOpen &&
                <div
                    className={classNames('absolute top-14 z-20', {'right-0': calendarHorizontalAlign === CalendarHorizontalAlign.Left})}
                    style={isCalendarPositionComputed ? {top: calendarPositionTop} : undefined}
                    onClick={onCalendarWrapperClick}
                >
                    <Calendar
                        isWeekendDisabled={isWeekendDisabled}
                        onBlur={onCalendarBlur}
                        date={date}
                        max={max}
                        min={min}
                        onChange={onCalendarValueChange} />
                </div>
            }
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
