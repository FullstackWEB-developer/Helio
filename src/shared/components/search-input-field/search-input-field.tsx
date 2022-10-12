import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './search-input-field.scss';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import customHooks from '@shared/hooks/customHooks';
import {Option} from '@components/option/option';
import SelectCell from '@components/select/select-cell';
import classnames from 'classnames';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
interface SearchInputProps {
    value?: string,
    onChange?: (value: string) => void,
    wrapperClassNames?: string,
    iconWrapperClassName?: string,
    inputClassNames?: string,
    disableSearchIcon?: boolean,
    onFocus?: () => void,
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void,
    inputOnClick?: () => void,
    iconOnClick?: () => void,
    onBlur?: () => void,
    onClear?: () => void;
    placeholder?: string,
    shouldDisplayAutocomplete?: boolean,
    autosuggestOptions?: Option[],
    autosuggestDropdown?: boolean,
    onDropdownSuggestionClick?: (suggestion: Option) => void,
    suggestionsPlaceholder?: string,
    suggestionsEmptyPlaceholder?: string,
    autoSuggestDropdownClose?: boolean,
    hasBorderBottom?: boolean;
    onPressEnter?: (value: string) => void;
    dataTestId?: string;
}
const SearchInputField = React.forwardRef<HTMLInputElement, SearchInputProps>(({
    autosuggestOptions,
    autosuggestDropdown,
    onDropdownSuggestionClick,
    suggestionsPlaceholder,
    suggestionsEmptyPlaceholder,
    autoSuggestDropdownClose,
    hasBorderBottom = true,
    onPressEnter,
    dataTestId = "search",
    ...props
}: SearchInputProps, ref) => {
    const {t} = useTranslation();
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    useEffect(() => {
        if (props.value) {
            setValue(props.value);
        }
    }, [props.value]);

    useEffect(() => {
        if (!props.value?.length) {
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
        if (autosuggestDropdown) {
            setDropdownOpen(true);
        }
    }
    const onBlur = () => {
        setIsFocused(false);
        if (props.onBlur) {
            props.onBlur();
        }
        if (autosuggestDropdown) {
            setDropdownOpen(false);
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
        if (e.key === keyboardKeys.enter) {
            onPressEnter?.(value);
        }
    }
    const onSelectCellClick = (option: Option) => {
        if (onDropdownSuggestionClick) {
            onDropdownSuggestionClick(option);
        }
        if (autoSuggestDropdownClose) {
            setDropdownOpen(false);
        }
    }

    const onTextClear = () => {
        clearValue()
        if (props.onClear) {
            props.onClear();
        }
    }

    return (
        <div className={`relative h-10 w-full search-input-field flex items-center ${props.wrapperClassNames ? props.wrapperClassNames : ''}`}>
            {!props.disableSearchIcon && <div className={classnames("absolute pl-4", props.iconWrapperClassName)}>
                <SvgIcon type={Icon.Search} className="cursor-pointer icon-small" fillClass="search-icon-fill" onClick={props?.iconOnClick} />
            </div>}
            <input ref={innerRef} type='text' data-testid={dataTestId}
                className={classnames('py-2.5 h-full w-full search-input-field body2', props.inputClassNames, 
                {'pl-12': !props.disableSearchIcon, 'border-b': hasBorderBottom, 'pr-11': isFocused && value})}
                placeholder={!props.placeholder ? t('common.search') : t(props.placeholder)}
                value={value}
                onChange={onChange}
                onFocus={() => {onFocus()}}
                onClick={() => {onClick()}}
                onBlur={() => {onBlur()}}
                onKeyDown={(e) => {onKeyDown(e)}}
                autoComplete={props.shouldDisplayAutocomplete ? 'on' : 'off'} />
            {
                isFocused && value && (
                    <span data-testid='clear-tetxt' onClick={onTextClear} onMouseDown={(e) => {e.preventDefault()}} className="absolute cursor-pointer right-4">
                        <SvgIcon type={Icon.Clear} fillClass="clear-input-icon-fill" />
                    </span>
                )
            }
            {autosuggestDropdown &&
                <div className={`search-input-field-options mb-2 ${dropdownOpen ? 'search-input-field-options-visible' : 'hidden'} absolute block py-2 mt-0.5`}>
                    {(!autosuggestOptions || autosuggestOptions.length <= 0) &&
                        <div className="w-full pt-2 text-center subtitle3-small">
                            {t(suggestionsEmptyPlaceholder || 'common.empty_search_result')}
                        </div>
                    }
                    {autosuggestOptions && autosuggestOptions.length > 0 &&
                        autosuggestOptions.map((option: Option) =>
                            <SelectCell item={option} key={`${option.value}`}
                                onClick={() => onSelectCellClick(option)}
                                disabled={option.disabled}
                            />)
                    }
                    {(!value && (!autosuggestOptions || autosuggestOptions.length > 0)) &&
                        <div className="w-full pt-2 text-center subtitle3-small">
                            {t(suggestionsPlaceholder || 'common.autocomplete_search')}
                        </div>
                    }
                </div>
            }
        </div>
    );
});

export default SearchInputField;
