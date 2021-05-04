import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './search-input-field.scss';
import { Icon } from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import customHooks from '@shared/hooks/customHooks';

interface SearchInputProps {
    value?: string,
    onChange?: (value: string) => void,
    wrapperClassNames?: string,
    inputClassNames?: string,
    onFocus?: () => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    inputOnClick?: () => void,
    iconOnClick?: () => void,
    onBlur?: () => void,
    placeholder?: string,
    shouldDisplayAutocomplete?: boolean
}
const SearchInputField = React.forwardRef<HTMLInputElement, SearchInputProps>((props: SearchInputProps, ref) => {
    const { t } = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    useEffect(() => {
        if (props.value) {
            setValue(props.value);
        }
    }, []);
    useEffect(() => {
        if(!props.value?.length){
            setValue('');
        }
    }, [props.value])
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        if (props.onChange) {
            props.onChange(e.target.value);
        }
    }
    const clearValue = () => {
        setValue('');
        if (props.onChange) {
            props.onChange('');
        }
        if (innerRef?.current) {
            innerRef.current.focus();
        }
    }
    const onFocus = () => {
        setIsFocused(true);
        if (props.onFocus) {
            props.onFocus();
        }
    }
    const onBlur = () => {
        setIsFocused(false);
        if (props.onBlur) {
            props.onBlur();
        }
    }
    const onClick = () => {
        if (props.inputOnClick) {
            props.inputOnClick();
        }
    }
    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (props.onKeyDown) {
            props.onKeyDown(e);
        }
    }
    return (
        <div className={`relative h-10 w-full flex items-center ${props.wrapperClassNames ? props.wrapperClassNames : ''}`}>
            <div className="absolute pl-4">
                <SvgIcon type={Icon.Search} className="icon-small cursor-pointer" fillClass="search-icon-fill" onClick={props?.iconOnClick} />
            </div>
            <input ref={innerRef} type='text' className={`pl-12 py-2.5 h-full w-full search-input-field body2 ${props.inputClassNames ? props.inputClassNames : ''}`}
                placeholder={props.placeholder || t('common.search')}
                value={value} onChange={onChange}
                onFocus={() => { onFocus() }}
                onClick={() => { onClick() }}
                onBlur={() => { onBlur() }}
                onKeyDown={(e) => { onKeyDown(e) }}
                autoComplete={props.shouldDisplayAutocomplete ? 'on': 'off'} />
            {
                isFocused && value && (
                    <span onClick={(e) => { clearValue() }} onMouseDown={(e) => { e.preventDefault() }} className="absolute right-4 cursor-pointer">
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill" />
                    </span>
                )
            }
        </div>
    );
});

export default SearchInputField;
