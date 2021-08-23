import React from 'react';
import './checkbox.scss';
import SvgIcon from '../svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';
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
    assistiveText?: string;
    onChange?: (event: CheckboxCheckEvent) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
    name,
    label,
    value = '',
    checked,
    defaultChecked,
    className,
    truncate = false,
    assistiveText,
    onChange,
    ...props
}: CheckboxProps, ref) => {
    const {t} = useTranslation();

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
            <span className={classnames({'truncate': truncate, 'w-60': !assistiveText})}>{t(label)}</span>
            {!!assistiveText &&
                <span className='body3-medium ml-1.5'>{t(assistiveText)}</span>
            }
        </label>
    </div>
});

export default Checkbox;
