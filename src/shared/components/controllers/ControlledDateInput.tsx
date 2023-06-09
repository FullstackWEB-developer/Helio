import React from 'react';
import {Controller} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@components/date-time-picker';
import {CalendarHorizontalAlign} from "@components/date-time-picker/calendar-align-enum";

export interface ControllerDateInputProps {
    control: Control;
    required?: boolean;
    errorMessage?: string;
    disabled?: boolean;
    name: string;
    value?: Date;
    max?: Date;
    min?: Date;
    label?: string;
    defaultValue?: Date | null;
    className?: string;
    dataTestId?: string;
    longDateFormat?: boolean;
    type?: 'date' | 'time';
    isWeekendDisabled?: boolean;
    isCalendarDisabled?: boolean;
    isCalendarPositionComputed?: boolean;
    calendarHorizontalAlign?: CalendarHorizontalAlign;
    assistiveText?: string;
    isSmallSize?:boolean,
    onValidationError?: () => void;
    onChange?: (date: Date | undefined) => void;
    onCalendarVisibilityChange?: (isVisible: boolean) => void;
    onPressEnter?: () => void;
}

const ControlledDateInput = ({
    control,
    name,
    disabled,
    dataTestId = name,
    max,
    min,
    defaultValue,
    value,
    className,
    longDateFormat = true,
    required = false,
    type = 'date',
    label = '',
    calendarHorizontalAlign,
    isCalendarDisabled,
    assistiveText,
    isCalendarPositionComputed,
    isSmallSize = false,
    onValidationError,
    onCalendarVisibilityChange,
    onPressEnter,
    isWeekendDisabled,
    ...props
}: ControllerDateInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');

    const onChange = (date: Date | undefined) => {
        control.setValue(name, date, {
            shouldValidate: true
        });

        if (props.onChange) {
            props.onChange(date);
        }
    }

    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{required: required ? requiredText : ''}}
        defaultValue={defaultValue}
        render={(controllerProps) => (
            <DateTimePicker
                {...controllerProps}
                required={required}
                disabled={disabled}
                value={value}
                isWeekendDisabled={isWeekendDisabled}
                calendarHorizontalAlign={calendarHorizontalAlign}
                calendarContainerClassName={className}
                assistiveText={assistiveText ? t(assistiveText): undefined}
                max={max}
                min={min}
                isCalendarDisabled={isCalendarDisabled}
                isCalendarPositionComputed={isCalendarPositionComputed}
                longDateFormat={longDateFormat}
                label={t(label)}
                error={props.errorMessage || control.formState.errors[name]?.message}
                isSmallSize={isSmallSize}
                onChange={onChange}
                onValidationError={onValidationError}
                onCalendarVisibilityChange={onCalendarVisibilityChange}
                onPressEnter={onPressEnter}
            />
        )}
    />);
}

export default ControlledDateInput;
