import React from 'react';
import {useTranslation} from 'react-i18next';
import classnames from 'classnames';
import './radio-single.scss';

interface RadioSingleProps {
    name: string;
    label: string;
    value?: string;
    defaultChecked?: boolean;
    checked?: boolean;
    object?: any;
    className?: string;
    labelClassName?: string;
    radioClassName?: string;
    truncate?: boolean;
    onChange?: (value?: string, object?: any) => void;

}
const RadioSingle = React.forwardRef<HTMLInputElement, RadioSingleProps>(({
    name,
    label,
    object,
    defaultChecked,
    checked,
    value,
    className,
    radioClassName,
    labelClassName,
    truncate = false,
    ...props}: RadioSingleProps, ref) => {
    const {t} = useTranslation();


    return (
        <div key={`${name}_${value}`} className={classnames('h-9 radio-single', radioClassName)}>
            <input
                {...props}
                type='radio'
                value={value}
                defaultChecked={defaultChecked}
                checked={checked}
                ref={ref}
                id={`${name}_${value}`}
                name={name}
                onChange={_ => props.onChange && props.onChange(value, object)} />
            <label htmlFor={`${name}_${value}`}
                className={classnames('body2', labelClassName, {'truncate': truncate})}>
                {t(label)}
            </label>
        </div>
    );
});

export default RadioSingle;

