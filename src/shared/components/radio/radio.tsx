import React from 'react';
import './radio.scss';
import {Option} from '@components/option/option';

export interface RadioProps {
    name: string;
    items: Option[];
    defaultValue?: string;
    truncate?: boolean;
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    labelClassName?: string;
    radioClassname?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({
    name,
    className,
    items,
    onChange,
    defaultValue,
    value,
    radioClassname,
    labelClassName,
    truncate = false,
    ...props
}: RadioProps, ref) => {
    return <div className={className ? className : ''}>
        {
            items.map(item => {
                return <div key={`${name}_${item.value}`} className={`h-9 ${radioClassname ? radioClassname : ''}`}><input
                    {...props}
                    type='radio'
                    value={item.value}
                    defaultChecked={defaultValue !== undefined ? defaultValue === item.value : undefined}
                    checked={value !== undefined ? value === item.value : undefined}
                    ref={ref}
                    id={`${name}_${item.value}`}
                    name={name}
                    onChange={_ => onChange(item.value)} />
                    <label htmlFor={`${name}_${item.value}`}
                        className={`body2 ${truncate ? ' truncate' : ''} ${labelClassName ? labelClassName : ''}`}>{item.label}</label>
                </div>
            })
        }
    </div>;
});

export default Radio;
