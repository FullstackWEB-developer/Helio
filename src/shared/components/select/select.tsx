import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './select.scss';
import customHooks from '@shared/hooks/customHooks';
import { ReactComponent as ArrowUpIcon } from '@icons/Icon-Arrow-up-16px.svg';
import { ReactComponent as ArrowDownIcon } from '@icons/Icon-Arrow-down-16px.svg';
import SelectCell from './select-cell';
import { Option } from '@components/option/option';
interface SelectProps {
    label?: string;
    value?: Option;
    searchQuery?: string;
    options: Option[];
    error?: string;
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean,
    required?: boolean,
    onChange?: (option?: Option, searchQuery?: string) => void
}
const Select = React.forwardRef<HTMLDivElement, SelectProps>(({ options, order, label, ...props }: SelectProps, ref) => {
    const { t } : {t : any}= useTranslation();
    const [open, setOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    const [searchQuery, setSearchQuery] = useState<string | null>(null);
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
        if(props.onChange && props.searchQuery){
            props.onChange(undefined, e.target.value);
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
        if(props.onChange){            
            props.onChange(option);
        }
    }
    useEffect(() => {        
        if(props.value){
            setSelectedOption(props.value);
        }
    }, []);

    return (       
        <div ref={innerRef}
            onClick={() => { setOpen(!open) }}
            className={`select-wrapper relative w-full flex flex-col h-20 ${props.disabled ? 'select-wrapper-disabled' : ''}`}>
            <div className={`select relative flex flex-col ${open ? 'open' : ''}`}>
                <input
                    ref={inputRef}
                    type='text'
                    onChange={(e) => searchOnChange(e)}
                    onFocus={(e) => e.target.select()}
                    onBlur={(e) => { e.target.value = ''; setSearchQuery(null); }}
                    className={`pl-4 pt-6 pr-8 body2 h-14 relative truncate select-trigger ${props.error ? 'input-error' : ''} `}
                    value={searchQuery ?? t(selectedOption?.label)}
                    disabled={props.disabled}
                />
                {
                    label &&
                    <label
                        className={`select-label absolute ${selectedOption || open || searchQuery ? 'subtitle3-small label-small' : `body2${props.disabled ? '-medium' : ''}`} ${props.error ? 'text-danger' : ''}`}>
                        {`${props.required? '*':''}${t(label)}`}
                    </label>
                }
                <div className="absolute pt-5 right-4">
                    {
                        open ? <ArrowUpIcon onClick={() => setOpen(false)} /> :
                            <ArrowDownIcon onClick={() => setOpen(true)} />
                    }
                </div>
                <div className="options absolute block py-2">
                    {
                        renderOptions().map((option: Option, index) =>
                            <SelectCell item={option} key={`${index}-${option.value}`} isSelected={option.value === selectedOption?.value}
                                onClick={() => selectValueChange(option)} disabled={option.disabled} />)
                    }
                </div>
            </div>
            {
                props.assistiveText && !props.error &&
                <div className={`h-6 max-h-6 pl-4 ${open ? 'assistive-text-focus' : ''} subtitle3-small pt-1 truncate`}>
                    {props.assistiveText}
                </div>
            }
            {props.error && <div className={'h6 pl-4 subtitle3-small pt-1 text-danger truncate'}>{props.error}</div>}
        </div>
    );
});

export default Select;
