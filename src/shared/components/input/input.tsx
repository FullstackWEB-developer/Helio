import customHooks from '@shared/hooks/customHooks';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './input.scss';
// @ts-ignore
import InputMask from 'react-input-mask';
import ThreeDotsSmallLoader from '@components/skeleton-loader/three-dots-loader';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {Option} from '@components/option/option';
import SelectCell from '@components/select/select-cell';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';

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
    isLoading?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    shouldDisplayAutocomplete?: boolean,
    required?: boolean;
    dropdownIcon?: Icon
    autosuggestDropdown?: boolean;
    autosuggestOptions?: Option[];
    onDropdownSuggestionClick?: (suggestion: Option) => void;
    isFetchingSuggestions?: boolean;
    selectedSuggestion?: Option;
    fetchingSuggestionsPlaceholder?: string;
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({
    label,
    type,
    htmlFor,
    placeholder,
    mask,
    assistiveText,
    dropdownIcon,
    isLoading,
    autosuggestDropdown,
    autosuggestOptions,
    isFetchingSuggestions,
    selectedSuggestion,
    fetchingSuggestionsPlaceholder,
    onDropdownSuggestionClick,
    ...props
}: InputProps, ref) => {
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        if (props.value) {
        setValue(props.value || '');

        }
    }, [props.value]);
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        if (autosuggestDropdown) {
            setDropdownOpen(false);
        }
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

    const clearValue = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        setValue('');
        if (type === 'tel') {
            // @ts-ignore
            innerRef?.current?.props?.inputRef?.current?.setCursorPosition(1);
        }
        const event = Object.create(e);
        event.target.value = '';
        onChange(event as React.ChangeEvent<HTMLInputElement>);
    }

    const preventMousedownTriggerBlur = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        e.preventDefault();
    }

    const onSelectCellClick = (option: Option) => {
        if (onDropdownSuggestionClick) {
            onDropdownSuggestionClick(option);
        }
        setDropdownOpen(false);
    }

    const onInputFocus = () => {
        setIsFocused(true);
        if (autosuggestDropdown) {
            setDropdownOpen(true);
        }
    }

    return (
        <div className="input-group flex flex-col h-20">
            <div className={`input-group-container flex flex-wrap items=stretch w-full relative ${props.error ? 'input-error' : ''} ` + props.className}>
                <InputMask ref={innerRef} inputRef={innerRef} {...props}
                    mask={mask}
                    type={type}
                    onFocus={onInputFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    className={`pl-4 pt-6 body2 h-14 flex-shrink flex-grow flex-auto leading-normal w-px flex-1`}
                    placeholder=''
                    value={value}
                    disabled={props.disabled || isLoading}
                    autoComplete={props.shouldDisplayAutocomplete ? 'on' : 'off'} />
                <label htmlFor={htmlFor}
                       className={`absolute truncate ${props.required ? 'required' : ''} ${isFocused || value ? 'body3 label-small' : `body2${props.disabled ? '-medium' : ''}`} ${props.error ? 'text-danger' : ''}`}>
                    {t(label || placeholder || '')}
                </label>
                {dropdownIcon && <div className={`absolute pt-${!label ? '3' : '4'} right-4`}>
                    {
                        <SvgIcon type={dropdownIcon} fillClass={'select-arrow-fill'}/>
                    }
                </div>}
                {isFocused &&
                value &&
                <span
                    className="input-addon clear-input-icon flex items-center leading-normal rounded rounded-l-none px-3"
                    onMouseDown={(e) => preventMousedownTriggerBlur(e)}
                    onClick={(e) => {
                        clearValue(e)
                    }}
                >
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill"/>
                    </span>}
                {isLoading &&
                    <span className="input-addon flex items-center leading-normal rounded rounded-l-none px-3">
                        <ThreeDotsSmallLoader className="three-dots-loader-small" cx={13} cxSpace={23} cy={16} />
                    </span>
                }
                {autosuggestDropdown &&
                    <div className={`options ${dropdownOpen ? 'options-visible' : ''} absolute block py-2`}>
                        {(!autosuggestOptions || autosuggestOptions.length <= 0) && !isFetchingSuggestions &&
                            <div className="subtitle3-small w-full text-center pt-2">
                                {t(fetchingSuggestionsPlaceholder || 'common.autocomplete_search')}
                            </div>
                        }
                        {isFetchingSuggestions && <ThreeDots className='w-full h-10' />}
                        {autosuggestOptions && autosuggestOptions.length > 0 &&
                            autosuggestOptions.map((option: Option) =>
                                <SelectCell item={option} key={`${option.value}`}
                                            isSelected={option.value === selectedSuggestion?.value}
                                            onClick={() => onSelectCellClick(option)}
                                            disabled={option.disabled}
                                />)
                        }
                    </div>
                }
            </div>

            {!!assistiveText && !props.error && !isLoading && <div
                className={`h-6 pl-4 body3 pt-1 truncate ${isFocused ? 'assistive-text-focus' : ''}`}>{t(assistiveText)}</div>}
            {props.error && <div className={'h6 pl-4 body3 pt-1 text-danger'}>{t(props.error)}</div>}
        </div>
    );
})

export default Input;
