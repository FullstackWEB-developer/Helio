import customHooks from '@shared/hooks/customHooks';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './input.scss';
// @ts-ignore
import InputMask from 'react-input-mask';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    error?: string,
    type?: 'text' | 'number' | 'email' | 'tel' | 'zip',
    mask?: string,
    htmlFor?: string,
    assistiveText?: string,
    disabled?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    shouldDisplayAutocomplete?: boolean
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, type, htmlFor, placeholder, mask, ...props }: InputProps, ref) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);

    useEffect(() => {
        if (props.value) {
            setValue(props.value);
        }
    }, []);

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (props.onBlur) {
            props.onBlur(e);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (props.onChange) {
            props.onChange(e);
        }
    }

    const clearValue = () => {
        if (innerRef?.current) {
            setValue('');
            innerRef.current.focus();
            Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')
                ?.set?.call(innerRef.current, '');
            innerRef.current.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }

    const preventMousedownTriggerBlur = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
    }

    return (
        <div className="input-group flex flex-col relative h-20">
            <InputMask inputRef={innerRef} {...props}
                mask={mask}
                type={type}
                onFocus={(e: React.FocusEvent<HTMLInputElement>) => { setIsFocused(true) }}
                onBlur={(e: React.FocusEvent<HTMLInputElement>) => { onBlur(e) }}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e)}
                className={`pl-4 pt-6 body2 h-14 ${props.error ? 'input-error' : ''} ` + props.className}
                placeholder=''
                value={value}
                disabled={props.disabled}
                autoComplete={props.shouldDisplayAutocomplete ? 'on' : 'off'} />
            <label htmlFor={htmlFor}
                   className={`absolute ${isFocused || value ? 'subtitle3-small label-small' : `body2${props.disabled ? '-medium' : ''}`} ${props.error ? 'text-danger' : ''}`}>
                {t(label || placeholder || '')}
            </label>
            {isFocused &&
            value &&
            <span
                onMouseDown={(e) => preventMousedownTriggerBlur(e)}
                onClick={(e) => { clearValue() }}
                className="clear-input-icon">
                    <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill"/>
            </span>}
            {props.assistiveText && !props.error && <div className={`h-6 pl-4 subtitle3-small pt-1 truncate ${isFocused ? 'assistive-text-focus' : ''}`}>{props.assistiveText}</div>}
            {props.error && <div className={'h6 pl-4 subtitle3-small pt-1 text-danger truncate'}>{props.error}</div>}
        </div>
    );
})

export default Input;
