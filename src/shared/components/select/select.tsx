import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './select.scss';
import customHooks from '@shared/hooks/customHooks';
import SelectCell from './select-cell';
import {Option} from '@components/option/option';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import Spinner from '@components/spinner/Spinner';
import classnames from 'classnames';
interface SelectProps {
    label?: string;
    value?: Option | string;
    searchQuery?: string;
    autoComplete?: boolean;
    options: Option[];
    error?: string;
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean;
    defaultValue?: Option | string | null;
    required?: boolean;
    suggestionsPlaceholder?: string;
    isLoading?: boolean;
    className?: string;
    onTextChange?: (value: string) => void;
    onSelect?: (option?: Option) => void;
    allowClear?: boolean;
}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(({options, order, label, className, autoComplete = true, defaultValue = null, allowClear =false, ...props}: SelectProps, ref) => {
    const {t}: {t: any} = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null | undefined>(typeof defaultValue === 'string' ? options.find(a => a.value === defaultValue) : defaultValue);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
    const [cursor, setCursor] = useState<number>(-1);
    let managedOptions = options && options.length > 0 ? [...options] : [];
    if (order) {
        managedOptions = managedOptions.sort((a, b) => a.label.localeCompare(b.label))
    }
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const inputRef = useRef<HTMLInputElement>(null);
    customHooks.useOutsideClick([innerRef], () => {
        setOpen(false);
    });


    const searchOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setCursor(0);
        if (props.onTextChange) {
            props.onTextChange(e.target.value);
        }
    }
    const renderOptions = (): Option[] => {
        if (searchQuery) {
            return managedOptions.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        return managedOptions;
    }
    const selectValueChange = (option?: Option) => {
        setSelectedOption(option);
        setSearchQuery(null);
        inputRef?.current?.blur();
        if (props.onSelect) {
            props.onSelect(option);
        }
    }

    useEffect(() => {
        if (typeof props.value === 'string') {
            if (selectedOption?.value !== props.value) {
                setSelectedOption(options.find(a => a.value.toString() === props.value?.toString())!);
            }
        } else if (props.value?.value) {
            if (props.value && selectedOption?.value !== props.value.value) {
                setSelectedOption(props.value);
            }
        }
        if (props.searchQuery) {
            setSearchQuery(props.searchQuery);
        }
    }, [props.value]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) {
            return;
        }
        switch (e.key) {
            case keyboardKeys.arrowUp: {
                e.preventDefault();
                if (cursor > 0) {
                    setCursor(cursor - 1);
                }
                break;
            }
            case keyboardKeys.arrowDown: {
                e.preventDefault();
                if (cursor < renderOptions().length - 1) {
                    setCursor(cursor + 1);
                }
                break;
            }
            case keyboardKeys.enter: {
                e.preventDefault();
                const currentlyAvailableOptions = renderOptions();
                if (cursor >= 0 && cursor <= currentlyAvailableOptions.length - 1) {
                    selectValueChange(currentlyAvailableOptions[cursor]);
                }
                break;
            }
        }
    }
    const handleArrowClick = () => {
        open ? inputRef.current?.blur() : inputRef.current?.focus();
    }

    const determineLabelTypography = () => {
        return `body${(open || searchQuery || selectedOption) ? '3' : '2'}`;
    }

    const determineAssistiveTextColor = () => {
        return `assistive-text-color-${open ? 'focused' : 'inactive'}`;
    }

    const OptionSection = () => {
        if (props.isLoading) {
            return <Spinner />
        }

        const currentOptions = renderOptions();
        if (currentOptions.length > 0) {
            return (
                <>
                    {
                        currentOptions.map((option: Option, index) =>
                            <SelectCell item={option}
                                key={`${index}-${option.value}`}
                                isSelected={option.value === selectedOption?.value}
                                onClick={() => selectValueChange(option)}
                                disabled={option.disabled}
                                className={`${cursor === index ? 'active' : ''}`}
                                changeCursorValueOnHover={() => setCursor(index)}
                            />)
                    }
                </>
            );
        }
        return (
            <div className="w-full pt-2 text-center subtitle3-small">
                {t(props.suggestionsPlaceholder || 'common.autocomplete_search')}
            </div>
        )
    }

    return (
        <div ref={innerRef}
            className={classnames(`select-wrapper relative w-full flex flex-col h-20 ${props.disabled ? 'select-wrapper-disabled' : ''}`, className)}>
            <div className={`select relative flex flex-col ${open ? 'open' : ''}`}>
                <input
                    ref={inputRef}
                    type='text'
                    autoComplete={autoComplete ? 'on' : 'none'}
                    onChange={(e) => searchOnChange(e)}
                    onFocus={(e) => {setOpen(true); e.target.select()}}
                    onBlur={(e) => {setOpen(false); e.target.value = ''; setSearchQuery(null); setCursor(-1)}}
                    onKeyDown={(e) => {handleKeyDown(e)}}
                    className={`pl-4 pr-8 body2 ${!label ? 'pt-2.5' : 'select-trigger-pt'} h-1${!label ? '0' : '4'} relative truncate select-trigger ${selectedOption || searchQuery ? 'activated' : ''} ${props.error ? 'error' : ''} `}
                    value={searchQuery ?? t(selectedOption?.label)}
                    disabled={props.disabled}
                />
                {
                    label &&
                    <label className={`select-label absolute truncate`}>
                        {props.required && !props.disabled && <span className={'text-danger'}>*</span>}
                        <span className={`select-label-span ${determineLabelTypography()}`}>{t(label)}</span>
                    </label>
                }
                <div className={`absolute pt-${!label ? '3' : '4'} right-4 `}>
                    <div className='flex flex-row items-start'>
                            {allowClear && selectedOption && open  &&
                            <div  onMouseDown={(e) => {e.preventDefault()}}>
                                <SvgIcon className='cursor-pointer'
                                         type={Icon.Clear}
                                         fillClass='select-arrow-fill'
                                         onClick={() => selectValueChange()} />
                            </div>
                            }
                        <div className='cursor-pointer' onClick={handleArrowClick} onMouseDown={(e) => {e.preventDefault()}}>
                            {
                                <SvgIcon type={open ? Icon.ArrowUp : Icon.ArrowDown} fillClass={'select-arrow-fill'} />
                            }
                        </div>
                    </div>
                </div>
                <div className="absolute py-2 options">
                    <OptionSection />
                </div>
            </div>
            {
                props.assistiveText && !props.error &&
                <div className={`h-6 max-h-6 pl-4 ${open ? 'assistive-text-focus' : ''} body3 pt-1 truncate`}>
                    <span className={determineAssistiveTextColor()}>{props.assistiveText}</span>
                </div>
            }
            {props.error && <div className={'h6 pl-4 body3 pt-1 text-danger truncate'}>{props.error}</div>}
        </div>
    );
});

export default Select;
