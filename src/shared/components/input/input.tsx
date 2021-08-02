import customHooks from '@shared/hooks/customHooks';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './input.scss';
// @ts-ignore
import InputMask from 'react-input-mask';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {Option} from '@components/option/option';
import SelectCell from '@components/select/select-cell';
import Spinner from '@components/spinner/Spinner';
import {InputTypes} from './InputTypes';

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
    autoSuggestDropdown?: boolean;
    autoSuggestOptions?: Option[];
    forceAutoSuggestSelect?: boolean;
    dropdownIconClickHandler?: () => void;
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
    dropdownIconClickHandler,
    isLoading,
    autoSuggestDropdown,
    autoSuggestOptions,
    forceAutoSuggestSelect,
    isFetchingSuggestions,
    selectedSuggestion,
    fetchingSuggestionsPlaceholder,
    onDropdownSuggestionClick,
    ...props
}: InputProps, ref) => {
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const validateNumberValue = React.useCallback((event: any) => {
        if (!event.target.value || !InputTypes.Number.test(event.target.value)) {
            event.target.value = '';
        }
    }, []);

    useEffect(() => {
        if (type !== 'number') {
            return;
        }

        const inputNode: HTMLInputElement = (innerRef?.current as any)?.getInputDOMNode();
        inputNode.addEventListener('input', validateNumberValue);

        return () => {
            inputNode.removeEventListener('input', validateNumberValue)
        }

    }, [])

    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);

        if (autoSuggestDropdown) {
            setDropdownOpen(false);

            if (forceAutoSuggestSelect) {
                const event = Object.create(e);

                if (!selectedSuggestion) {
                    event.target.value = '';
                } else if (props.value === '') {
                    event.target.value = selectedSuggestion.label;
                }

                onChange(event as React.ChangeEvent<HTMLInputElement>);
            }

        }
        if (props.onBlur) {
            props.onBlur(e);
        }
    }

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (props.onChange) {
            props.onChange(e);
        }
    }

    const clearValue = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
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
        if (autoSuggestDropdown) {
            setDropdownOpen(true);
        }
    }

    return (
        <div className="flex flex-col h-20 input-group">
            <div className={`input-group-container flex flex-wrap items=stretch w-full relative ${props.error ? 'input-error' : ''} ` + props.className}>
                <InputMask ref={innerRef} inputRef={innerRef} {...props}
                    mask={mask}
                    type={type}
                    onFocus={onInputFocus}
                    onBlur={onBlur}
                    onChange={onChange}
                    className={`pl-4 pt-6 body2 h-14 flex-shrink flex-grow flex-auto leading-normal w-px flex-1`}
                    placeholder=''
                    value={props.value}
                    disabled={props.disabled || isLoading}
                    autoComplete={props.shouldDisplayAutocomplete ? 'on' : 'off'} />
                <label htmlFor={htmlFor}
                    className={`absolute truncate ${props.required ? 'required' : ''} ${isFocused || props.value ? 'body3 label-small' : `body2${props.disabled ? '-medium' : ''}`} ${props.error ? 'text-danger' : ''}`}>
                    {t(label || placeholder || '')}
                </label>
                {dropdownIcon && (!isFocused || !props.value) && <div className={`absolute pt-${!label ? '3' : '4'} right-4 ${dropdownIconClickHandler ? 'cursor-pointer' : ''}`}>
                    {
                        <SvgIcon type={dropdownIcon} onClick={dropdownIconClickHandler} fillClass={'select-arrow-fill'} />
                    }
                </div>}
                {isFocused &&
                    props.value &&
                    <span
                        className="flex items-center px-3 leading-normal rounded rounded-l-none input-addon clear-input-icon"
                        onMouseDown={(e) => preventMousedownTriggerBlur(e)}
                        onClick={(e) => {
                            clearValue(e)
                        }}
                    >
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill" />
                    </span>}
                {isLoading &&
                    <span className="flex items-center px-3 leading-normal rounded rounded-l-none input-addon">
                        <Spinner size='small' />
                    </span>
                }
                {autoSuggestDropdown &&
                    <div className={`options ${dropdownOpen ? 'options-visible' : ''} absolute block py-2`}>
                        {(!autoSuggestOptions || autoSuggestOptions.length <= 0) && !isFetchingSuggestions &&
                            <div className="w-full pt-2 text-center subtitle3-small">
                                {t(fetchingSuggestionsPlaceholder || 'common.autocomplete_search')}
                            </div>
                        }
                        {isFetchingSuggestions && <Spinner size='medium' />}
                        {autoSuggestOptions && autoSuggestOptions.length > 0 &&
                            autoSuggestOptions.map((option: Option) =>
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
