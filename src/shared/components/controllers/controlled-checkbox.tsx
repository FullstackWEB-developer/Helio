import React from 'react';
import {Control} from 'react-hook-form/dist/types/form';
import {Controller} from 'react-hook-form';
import Checkbox, {CheckboxCheckEvent} from '@components/checkbox/checkbox';

interface ControlledCheckboxProps {
    control: Control;
    name: string
    label: string;
    value?: string;
    assistiveText?: string;
    className?: string;
    labelClassName?: string;
    hasTooltip?: boolean;
    onChange?: (event: CheckboxCheckEvent) => void;
}
const ControlledCheckbox = ({control, name, label, value, assistiveText, className, labelClassName, hasTooltip, ...props}: ControlledCheckboxProps) => {
    return (
        <Controller
            control={control}
            name={name}
            key={name}
            render={(controllerProps) => {
                return (<Checkbox
                    {...controllerProps}
                    className={className}
                    checked={controllerProps.value?.checked ?? false}
                    truncate={true}
                    label={label}
                    assistiveText={assistiveText}
                    data-test-id={`${name}-checkbox-${value}`}
                    labelClassName={labelClassName}
                    hasTooltip={hasTooltip}
                    value={value}
                    onChange={(e: CheckboxCheckEvent) => {
                        controllerProps.onChange(e);
                        props.onChange?.(e);
                        control.setValue(name, e, {shouldValidate: true});
                    }}
                />)
            }}
        />
    );
}

export default ControlledCheckbox;
