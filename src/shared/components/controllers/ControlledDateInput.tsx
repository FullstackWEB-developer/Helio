import React from 'react';
import {Controller} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';
import DateTimePicker from '@components/date-time-picker';
import {CalendarHorizontalAlign} from "@components/date-time-picker/calendar-align-enum";
export interface ControllerDateInputProps {
    control: Control;
    required?: boolean;
    name: string;
    value?: Date,
    max?: Date,
    min?: Date,
    label?: string;
    dataTestId: string;
    type?: 'date' | 'time';
    isWeekendDisabled?: boolean;
    calendarHorizontalAlign?: CalendarHorizontalAlign;
    onValidationError?: () => void;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlledDateInput = ({
    control,
    name,
    dataTestId,
    max,
    min,
    required = false,
    type = 'date',
    label = '',
    calendarHorizontalAlign,
    onValidationError,
    isWeekendDisabled,
    ...props
}: ControllerDateInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');
    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{required: required ? requiredText : ''}}
        defaultValue=''
        render={(controllerProps) => (
            <DateTimePicker
                {...controllerProps}
                required={required}
                isWeekendDisabled={isWeekendDisabled}
                calendarHorizontalAlign={calendarHorizontalAlign}
                max={max}
                min={min}
                label={t(label)}
                error={control.formState.errors[name]?.message}
                onChange={(date) => controllerProps.onChange(date)}
                onValidationError={onValidationError}
            />
        )}
    />);
}

export default ControlledDateInput;
