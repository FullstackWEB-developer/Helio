import React from 'react';
import {Controller} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@components/date-time-picker';
import {CalendarHorizontalAlign} from "@components/date-time-picker/calendar-align-enum";

export interface ControllerDateInputProps {
    control: Control;
    required?: boolean;
    disabled?: boolean;
    name: string;
    value?: Date,
    max?: Date,
    min?: Date,
    label?: string;
    defaultValue?: Date;
    className?: string;
    dataTestId: string;
    type?: 'date' | 'time';
    isWeekendDisabled?: boolean;
    calendarHorizontalAlign?: CalendarHorizontalAlign;
    onValidationError?: () => void;
    onChange?: (date: Date | undefined) => void;
    onCalendarVisibilityChange?: (isVisible: boolean) => void;
}

const ControlledDateInput = ({
    control,
    name,
    disabled,
    dataTestId,
    max,
    min,
    defaultValue,
    className,
    required = false,
    type = 'date',
    label = '',
    calendarHorizontalAlign,
    onValidationError,
    onCalendarVisibilityChange,
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
                isWeekendDisabled={isWeekendDisabled}
                calendarHorizontalAlign={calendarHorizontalAlign}
                calendarContainerClassName={className}
                max={max}
                min={min}
                label={t(label)}
                error={control.formState.errors[name]?.message}
                onChange={onChange}
                onValidationError={onValidationError}
                onCalendarVisibilityChange={onCalendarVisibilityChange}
            />
        )}
    />);
}

export default ControlledDateInput;
