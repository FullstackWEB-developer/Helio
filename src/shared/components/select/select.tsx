import React from 'react';
import Label from '../label/label';

interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {

    label?: string,
    value?: string,
    options: Option[],
    error?: string
}

export interface Option {
    value: string,
    label: string,
    hidden?: boolean,
    isAsterisk?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, label, className, ...props }, ref) => {
    return (
        <div>
            {label && <Label text={label} className='block subtitle' />}
            <select ref={ref} className={'p-2 border ' + className}
                {...props}
            >
                {
                    options?.map((option: Option, index) => (
                        option.hidden ?
                        <option value={option.value} key={index} hidden>
                            {option.isAsterisk ?
                                '*' + option.label
                                 : option.label}
                        </option> :
                        <option value={option.value} key={index}>{option.label}</option>
                    ))
                }
            </select>
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </div>
    )
})

export default Select;
