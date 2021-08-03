import classNames from 'classnames';
import React, {useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import './time-picker.scss';
import Dropdown from '@components/dropdown/dropdown';
import {DropdownItemModel, DropdownModel} from '@components/dropdown/dropdown.models';
import customHooks from '@shared/hooks/customHooks';
import {useEffect} from 'react';

interface TimePickerProps {
    name?: string,
    label?: string;
    value?: string | undefined;
    error?: string;
    dataTestId?: string;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    autoComplete?: boolean;
    onChange?: (time: string | undefined) => void;
    onBlur?: () => void;
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(({
    label,
    name,
    value,
    dataTestId,
    onChange,
    onBlur,
    ...props}: TimePickerProps, ref) => {
    const {t}: {t: any} = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [isPickerOpen, setPickerOpen] = useState(false);

    useEffect(() => {
        setInputValue(value || '');
    }, [value]);

    const getInputClassName = () => classNames({
        'pt-2.5 h-10': !label,
        'input-pt h-14': label,
        'activated': !!inputValue,
        'error': !!props.error,
        'open': isPickerOpen
    });

    const getAssistiveTextContainerClassName = () => classNames('h-6 max-h-6 pl-4 body3 pt-1 truncate', {'assistive-text-focus': !!inputValue});

    const getAssistiveTextClassName = () => classNames({
        'assistive-text-color-focused': inputValue,
        'assistive-text-color-inactive': !inputValue
    });


    const onInputValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    }

    const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (!timepickerDropdownModel.items?.find(t => t.value === inputValue.trim())) {
            const event = Object.create(e);
            event.target.value = '';
            onInputValueChange(event as React.ChangeEvent<HTMLInputElement>);
        }
        if (onBlur) {
            onBlur();
        }
    }

    const getLabelClassName = () => classNames('label-span', {
        'body2': !inputValue,
        'body3': inputValue
    });


    const generateTimeOptions = (interval: number = 30): DropdownItemModel[] => {
        let times: DropdownItemModel[] = [];
        let meridiem = ['AM', 'PM'];
        for (let startTime = 0; startTime < 24 * 60; startTime += interval) {
            let hh = Math.floor(startTime / 60);
            let mm = startTime % 60;
            let timeOption = `${hh === 0 || hh === 12 ? '12' : (hh % 12).toString().slice(-2)}:${('0' + mm).slice(-2)} ${meridiem[hh < 12 ? 0 : 1]}`;
            times.push(
                {
                    label: timeOption,
                    value: timeOption
                }
            );
        }
        return times;
    }

    const timepickerDropdownModel: DropdownModel = {
        onClick: (id: string, item: DropdownItemModel) => timepickerTimeSelected(id, item),
        items: generateTimeOptions(),
        defaultValue: inputValue
    };

    const timepickerTimeSelected = (id: string, item: DropdownItemModel) => {
        setInputValue(item.value);
        if (onChange) {
            onChange(item.value);
        };
        setPickerOpen(false);
        timepickerRef?.current?.blur();
    }
    const innerRef = customHooks.useCombinedForwardAndInnerRef(ref);
    const timepickerRef = useRef<HTMLInputElement>(null);
    customHooks.useOutsideClick([innerRef], () => {
        setPickerOpen(false);
    });

    return (<div ref={innerRef} className={classNames('time-picker relative w-full flex flex-col h-20', {'time-picker-disabled': props.disabled})}>
        <div className={classNames('time-picker-container relative flex flex-wrap')}>
            <input
                ref={timepickerRef}
                name={name}
                type='text'
                onBlur={onInputBlur}
                onChange={onInputValueChange}
                onFocus={() => setPickerOpen(true)}
                data-test-id={dataTestId}
                className={`w-px pl-4 body2 relative truncate flex-shrink flex-grow flex-auto leading-normal ${getInputClassName()}`}
                value={inputValue}
                disabled={props.disabled}
                autoComplete={props.autoComplete ? 'on' : 'off'}
            />
            {label &&
                <label className='absolute truncate'>
                    {props.required && !props.disabled &&
                        <span className='text-danger'>*</span>
                    }
                    <span className={getLabelClassName()}>{t(label)}</span>
                </label>
            }
        </div>
        {
            isPickerOpen &&
            <div className="z-30 w-full">
                <Dropdown model={timepickerDropdownModel} />
            </div>
        }
        {props.assistiveText && !props.error &&
            <div className={getAssistiveTextContainerClassName()}>
                <span className={getAssistiveTextClassName()}>{props.assistiveText}</span>
            </div>
        }
        {props.error &&
            <div className='h6 pl-4 body3 pt-1 text-danger truncate'>{props.error}</div>
        }
    </div>);
});

export default TimePicker;

