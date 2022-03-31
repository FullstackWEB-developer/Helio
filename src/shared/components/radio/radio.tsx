import React from 'react';
import './radio.scss';
import {Option} from '@components/option/option';
import {useTranslation} from 'react-i18next';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import classNames from 'classnames';

export interface RadioProps {
    name: string;
    items: Option[];
    defaultValue?: string;
    truncate?: boolean;
    value?: string;
    onChange: (value: string, object?: any) => void;
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
    const {t} = useTranslation();
    return <div className={className ? className : ''}>
        {
            items.map(item => {
                return <div key={`${name}_${item.value}`} className={`radio h-9 ${radioClassname ? radioClassname : ''}`}>
                    <input
                        {...props}
                        type='radio'
                        value={item.value}
                        defaultChecked={defaultValue !== undefined ? defaultValue === item.value : undefined}
                        checked={value !== undefined ? value === item.value : undefined}
                        ref={ref}
                        id={`${name}_${item.value}`}
                        name={name}
                        onChange={_ => onChange(item.value, item.object)} />
                    <label htmlFor={`${name}_${item.value}`}
                        className={`body2 ${truncate ? ' truncate' : ''} ${labelClassName ? labelClassName : ''}`}>
                        <ElipsisTooltipTextbox asSpan={true} value={t(item.label)}
                            classNames={classNames('body2', {labelClassName: !!labelClassName})}
                            yOffsetInPixels={-28} />
                    </label>
                </div>
            })
        }
    </div>;
});

export default Radio;
