import React from 'react';
import './checkbox.scss';
import SvgIcon from '../svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
export interface CheckboxCheckEvent {
    value: string;
    checked: boolean;
}

interface CheckboxProps {
    name: string,
    label: string,
    defaultChecked?: boolean,
    value?: string,
    truncate?: boolean;
    onChange?: (event: CheckboxCheckEvent) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({name, label, value='', defaultChecked = false, truncate = false, onChange, ...props}: CheckboxProps, ref) => {
    return <div className='h-9'>
        <label className="checkbox-button flex flex-row items-center">
            <input
                {...props}
                className='checkbox'
                type="checkbox"
                ref={ref}
                defaultChecked={defaultChecked}
                name={name}
                id={`${name}_${value}`}
                onChange={e => onChange && onChange({value, checked: e.target.checked})}
            />
            <span className="checkbox-control">
                <SvgIcon type={Icon.LightCheckBoxOn} fillClass='svg-checkbox'></SvgIcon>
            </span>
            <span className={'w-60 ' + (truncate ? ' truncate ' : '')}>{label}</span>
        </label>
    </div>
});

export default Checkbox;
