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
import {InputType, InputTypes} from './InputTypes';
import classnames from 'classnames';
import ReactInputDateMask from '@components/react-input-date-mask/ReactInputDateMask';
import {INPUT_DATE_FORMAT} from '@constants/form-constants';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    error?: string,
    type?: InputType,
    mask?: string,
    htmlFor?: string,
    assistiveText?: string,
    disabled?: boolean,
    isLoading?: boolean,
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void,
    onChangeDate?: (value: string) => void,
    shouldDisplayAutocomplete?: boolean,
    required?: boolean;
    dropdownIcon?: Icon,
    dropdownIconFill?: string,
    autoSuggestDropdown?: boolean;
    autoSuggestOptions?: Option[];
    forceAutoSuggestSelect?: boolean;
    dropdownIconClickHandler?: () => void;
    onDropdownSuggestionClick?: (suggestion: Option) => void;
    isFetchingSuggestions?: boolean;
    selectedSuggestion?: Option;
    fetchingSuggestionsPlaceholder?: string;
    containerClassName?: string;
    maxLength?: number;
    max?: number;
    applyTruncating?: boolean;
    dataTestId?: string;
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
    dropdownIconFill,
    isLoading,
    autoSuggestDropdown,
    autoSuggestOptions,
    forceAutoSuggestSelect,
    isFetchingSuggestions,
    selectedSuggestion,
    fetchingSuggestionsPlaceholder,
    shouldDisplayAutocomplete,
    containerClassName,
    onDropdownSuggestionClick,
    onChangeDate,
    dataTestId,
    ...props
}: InputProps, ref) => {
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const validateNumberValue = React.useCallback((event: any) => {
        if (!event.target.value || !InputTypes.Number.test(event.target.value)) {
            event.target.value = '';
            onChange(event as React.ChangeEvent<HTMLInputElement>);
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
        if (props.maxLength && e.target.value.length > props.maxLength) {
            return;
        }
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
    const elipsisTextboxWidthStyle = {'maxWidth': !!dropdownIcon ? 'calc(100% - 2.75rem)' : '100%'};
    const inputMaskClassname = classnames(' pt-6 body2 h-14 flex-shrink flex-grow flex-auto leading-normal w-px flex-1 input-date-mask', {
        'pl-7' : !!props.prefix,
        'pl-4' : !props.prefix
    })

    let component =
        props.applyTruncating && props.disabled ?
            <div className='flex pl-4 pt-6 h-14' style={elipsisTextboxWidthStyle}>
                <ElipsisTooltipTextbox value={props.value || ''}
                    asSpan={true}
                    classNames={'body2 leading-normal'} />
            </div> :
            <InputMask data-testid={props.name} ref={innerRef} inputRef={innerRef} {...props}
                mask={mask}
                type={type}
                onFocus={onInputFocus}
                onWheel={(e) => { if(type === 'number') {e.currentTarget.blur()}}}
                onBlur={onBlur}
                onChange={onChange}
                className={inputMaskClassname}
                placeholder=''
                value={props.value}
                disabled={props.disabled || isLoading}
                autoComplete={shouldDisplayAutocomplete ? 'on' : 'off'} />;
    if (type === 'date') {
        component = <ReactInputDateMask {...props}
            mask={INPUT_DATE_FORMAT}
            type={type}
            dataTestId={dataTestId}
            showMaskOnFocus={true}
            onFocus={onInputFocus}
            onBlur={onBlur}
            onChange={onChangeDate}
            className='flex-1 flex-auto flex-grow flex-shrink w-px pt-6 pl-4 leading-normal body2 h-14 input-date-mask date-label-mask'
            value={props.value}
            disabled={props.disabled || isLoading}
        />
    }
    return (
        <div className={classnames("flex flex-col h-20 input-group", containerClassName)}>
            <div className={`input-group-container flex flex-wrap items-stretch w-full relative ${props.error ? 'input-error' : ''} ` + props.className}>
                {component}
                <label htmlFor={htmlFor}
                    className={`absolute truncate ${props.required ? 'required' : ''} ${isFocused || props.value || (!!props?.value?.toString() && props.value.toString().length) > 0 ? 'body3 label-small' : `body2${props.disabled ? '-medium' : ''}`} ${props.error ? 'text-danger' : ''}`}>
                    {t(label || placeholder || '')}
                </label>
                {props.prefix && <div className={`absolute pt-${!label ? '4' : '6'}  left-4 body2-medium`}>
                    {
                        props.prefix
                    }
                </div>}
                {dropdownIcon && (!isFocused || !props.value) && <div className={`absolute pt-${!label ? '3' : '4'} right-4 ${dropdownIconClickHandler ? 'cursor-pointer' : ''}`}>
                    {
                        <SvgIcon type={dropdownIcon} onClick={dropdownIconClickHandler} fillClass={dropdownIconFill ?? 'select-arrow-fill'} />
                    }
                </div>}
                {(isFocused && props.value) ?  <span
                        className="flex items-center px-3 leading-normal rounded rounded-l-none input-addon clear-input-icon"
                        onMouseDown={(e) => preventMousedownTriggerBlur(e)}
                        onClick={(e) => {
                            clearValue(e)
                        }}
                    >
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill" />
                    </span> : null}
                {isLoading &&
                    <span className="flex items-center px-3 leading-normal rounded rounded-l-none input-addon">
                        <Spinner size='small' />
                    </span>
                }
                {autoSuggestDropdown && isFocused &&
                    <div className={`input-options ${dropdownOpen ? 'options-visible' : 'hidden'} absolute block py-2`}>
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
