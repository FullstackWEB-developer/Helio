import React from 'react';
import {Control} from 'react-hook-form/dist/types/form';
import {Controller} from 'react-hook-form';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';

interface ControlledCheckboxProps {
    control: Control;
    name: string
    label: string;
    value?: string;
    className?: string;
}
const ControlledCheckbox = ({control, name, label, value, className}: ControlledCheckboxProps) => {
    return (
        <Controller
            control={control}
            name={name}
            key={name}
            render={(props) => {
                return (<Checkbox
                    {...props}
                    className={className}
                    checked={props.value?.checked ?? false}
                    truncate={true}
                    label={label}
                    data-test-id={`${name}-checkbox-${value}`}
                    value={value}
                    onChange={(e: CheckboxCheckEvent) => {
                        props.onChange(e);
                        control.setValue(name, e, {shouldValidate: true})
                    }}
                />)
            }}
        />
    );
}

export default ControlledCheckbox;
