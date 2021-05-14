import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {Controller, ControllerRenderProps} from 'react-hook-form';
import React from 'react';
import {Control} from 'react-hook-form/dist/types/form';

export interface ControlledSelectProps {
    name: string;
    control: Control;
    label?: string;
    value?: Option | string;
    searchQuery?: string;
    options: Option[];
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    onTextChange?: (value: string) => void;
    onSelect?: (option?: Option) => void
}

const ControlledSelect = ({
    control,
    options,
    name,
    label,
    value,
    searchQuery,
    order,
    assistiveText,
    disabled,
    onSelect,
    onTextChange,
    required = false
}: ControlledSelectProps) => {
    const onSelected = (controllerProps: ControllerRenderProps, option?: Option) => {
        if (option) {
            if (onSelect) {
                onSelect(option);
            }
            controllerProps.onChange(option.value);
        }
    }

    return <Controller
        name={name}
        control={control}
        defaultValue=''
        render={(controllerProps) => (
            <Select
                {...controllerProps}
                onSelect={(option) => onSelected(controllerProps, option)}
                data-test-id={`${name}-test-id`}
                label={label}
                options={options}
                required={required}
                searchQuery={searchQuery}
                order={order}
                assistiveText={assistiveText}
                disabled={disabled}
                value={value}
                onTextChange={onTextChange}
                error={control.formState.errors[name]?.message}
            />
        )}
    />;
}
export default ControlledSelect;