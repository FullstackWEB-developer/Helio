import React from 'react';
import './checkbox.scss';
import SvgIcon from '../svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import classnames from 'classnames';
export interface CheckboxCheckEvent {
    value: string;
    checked: boolean;
}

interface CheckboxProps {
    name: string,
    label: string,
    defaultChecked?: boolean,
    checked?: boolean,
    value?: string,
    className?: string;
    truncate?: boolean;
    onChange?: (event: CheckboxCheckEvent) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
    name,
    label,
    value = '',
    checked,
    defaultChecked,
    className,
    truncate = false,
    onChange,
    ...props
}: CheckboxProps, ref) => {
    return <div className={classnames('h-9', className)}>
        <label className="flex flex-row items-center checkbox-button">
            <input
                {...props}
                className='checkbox'
                type="checkbox"
                ref={ref}
                defaultChecked={defaultChecked}
                checked={checked}
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
