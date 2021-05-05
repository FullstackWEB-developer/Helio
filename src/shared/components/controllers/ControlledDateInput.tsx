import React from 'react';
import {Controller, ControllerRenderProps} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';
import DateTimeInput from '@components/date-time-input/date-time-input';

export interface ControllerDateInputProps {
    control: Control;
    required?: boolean;
    name: string;
    className?: string;
    label?: string;
    dataTestId: string;
    min?: string;
    max?: string;
    type?: 'date' | 'time';
    placeholder?: string;
    defaultValue?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ControlledDateInput = ({control, required = false, type = 'date', name, label = '', className = '', dataTestId, min, max, placeholder, ...props}: ControllerDateInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');

    const onDateInputChanged = (event: React.ChangeEvent<HTMLInputElement>, controllerProps: ControllerRenderProps<Record<string, any>>) => {
        controllerProps.onChange(event);
        if (props.onChange) {
            props.onChange(event);
        }
    }

    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{
            required: required ? requiredText : ''
        }}
        defaultValue={props.defaultValue}
        render={(controllerProps) => (
            <DateTimeInput
                label={label}
                {...controllerProps}
                min={min}
                max={max}
                className={className}
                data-test-id={dataTestId}
                error={control.formState.errors[name]?.message}
                type={type}
                placeholder={placeholder}
                onChange={(event) => onDateInputChanged(event, controllerProps)}
            />
        )}
    />);
}

export default ControlledDateInput;
