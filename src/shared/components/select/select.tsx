import React from 'react';
import Label from '../label/label';
import { useTranslation } from 'react-i18next';

interface SelectProps extends React.HTMLAttributes<HTMLSelectElement> {

    label?: string;
    value?: string;
    options: Option[];
    error?: string;
    order?: boolean;
}

export interface Option {
    value: string,
    label: string,
    hidden?: boolean,
    disabled?: boolean
    isAsterisk?: boolean
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ options, order, label, className, ...props }, ref) => {
    const { t } = useTranslation();

    let managedOptions = options && options.length > 0 ? [...options] : [];
    if (order) {
        managedOptions = managedOptions.sort((a, b) => a.label.localeCompare(b.label))
    }
    return (
        <div>
            {label && <Label text={t(label)} className='block subtitle pb-2' />}
            <select ref={ref} className={'p-4 h-14 border ' + className}
                {...props}
            >
                {
                    managedOptions?.map((option: Option, index) => (
                        option.hidden ?
                        <option value={option.value} key={index} hidden>
                            {option.isAsterisk ?
                                '*' + option.label
                                 : option.label}
                        </option> :
                        <option disabled={option.disabled}  value={option.value} key={index}>{t(option.label)}</option>
                    ))
                }
            </select>
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </div>
    )
})

export default Select;
