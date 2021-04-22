import React, {useRef, useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import './select.scss';
import customHooks from '@shared/hooks/customHooks';
import SelectCell from './select-cell';
import {Option} from '@components/option/option';
import {keyboardKeys} from '@components/search-bar/constants/keyboard-keys';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
interface SelectProps {
    label?: string;
    value?: Option;
    searchQuery?: string;
    options: Option[];
    error?: string;
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    onTextChange?: (value: string) => void;
    onSelect?: (option?: Option) => void;
}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(({options, order, label, ...props}: SelectProps, ref) => {
    const {t}: {t: any} = useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
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
    const selectValueChange = (option: Option) => {
        setSelectedOption(option);
        setSearchQuery(null);
        inputRef?.current?.blur();
        if (props.onSelect) {
            props.onSelect(option);
        }
    }
   
    useEffect(() => {
        if (props.value) {
            setSelectedOption(props.value);
        }
        if (props.searchQuery) {
            setSearchQuery(props.searchQuery);
        }
    }, []);
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!open) return;
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

    return (
        <div ref={innerRef}
            className={`select-wrapper relative w-full flex flex-col h-20 ${props.disabled ? 'select-wrapper-disabled' : ''}`}>
            <div className={`select relative flex flex-col ${open ? 'open' : ''}`}>
                <input
                    ref={inputRef}
                    type='text'
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
                <div className={`absolute pt-${!label ? '3' : '4'} right-4 cursor-pointer`} onClick={handleArrowClick} onMouseDown={(e) => {e.preventDefault()}}>
                    {
                        <SvgIcon type={open ? Icon.ArrowUp : Icon.ArrowDown} fillClass={'select-arrow-fill'} />
                    }
                </div>
                <div className="options absolute block py-2">
                    {
                        renderOptions().map((option: Option, index) =>
                            <SelectCell item={option} key={`${index}-${option.value}`} isSelected={option.value === selectedOption?.value}
                                onClick={() => selectValueChange(option)} disabled={option.disabled}
                                className={`${cursor === index ? 'active' : ''}`}
                                changeCursorValueOnHover={() => setCursor(index)}
                            />)
                    }
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
