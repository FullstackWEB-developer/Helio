import React from 'react';
import './checkbox.scss';
import SvgIcon from '../svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import classnames from 'classnames';
import {useTranslation} from 'react-i18next';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
export interface CheckboxCheckEvent {
    value: string;
    checked: boolean;
}

interface CheckboxProps {
    name: string,
    label?: string,
    defaultChecked?: boolean,
    checked?: boolean,
    value?: string,
    className?: string;
    labelClassName?: string;
    truncate?: boolean;
    assistiveText?: string;
    hasTooltip?: boolean;
    heightClass?: string;
    onChange?: (event: CheckboxCheckEvent) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
    name,
    label,
    value = '',
    checked,
    defaultChecked,
    className,
    labelClassName = 'w-60',
    truncate = false,
    assistiveText,
    hasTooltip = true,
    heightClass = 'h-9',
    onChange,
    ...props
}: CheckboxProps, ref) => {
    const {t} = useTranslation();

    return <div className={classnames(heightClass, className)}>
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
            {hasTooltip && label &&
                <ElipsisTooltipTextbox value={t(label)} classNames={classnames(labelClassName, {'w-60': !assistiveText})} asSpan={true} />
            }
            {!hasTooltip && label &&
                <div className={labelClassName}>{t(label)}</div>
            }
            {!!assistiveText &&
                <span className='body3-medium ml-1.5'>{t(assistiveText)}</span>
            }
        </label>
    </div>
});

export default Checkbox;
