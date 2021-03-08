import React from 'react';
import './radio.scss';
export interface RadioItem {
    label: string;
    value: string;
}

export interface RadioProps {
    name: string;
    items: RadioItem[];
    defaultValue? : string;
    truncate?: boolean;
    value?: string
    onChange: (value: string) => void;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({name, items,onChange, defaultValue, truncate = false, ...props} : RadioProps, ref)=>{
    return <div>
        {
            items.map(item => {
                return  <div key={`${name}_${item.value}`} className='h-9'><input
                            {...props}
                            type='radio'
                            value={item.value}
                            defaultChecked={defaultValue === item.value}
                            ref={ref}
                            id={`${name}_${item.value}`}
                            name={name}
                            onChange={_ => onChange(item.value)}/>
                            <label htmlFor={`${name}_${item.value}`} className={'w-60 text-secondary-900' + (truncate ? 'truncate' : '')}>{item.label}</label>
                </div>
            })
        }
    </div>;
});

export default Radio;
