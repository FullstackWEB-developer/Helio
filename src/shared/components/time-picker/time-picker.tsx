import classNames from 'classnames';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import './time-picker.scss';

interface TimePickerProps {
    name?: string,
    label?: string;
    value?: string | null;
    error?: string;
    dataTestId?: string;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    onChange?: (time: string | undefined) => void;
    onBlur?: () => void;
}

const TimePicker = ({label, name, value, dataTestId, onChange, onBlur, ...props}: TimePickerProps) => {
    const {t}: {t: any} = useTranslation();
    const [inputValue, setInputValue] = useState('');
    const [isPickerOpen, setPickerOpen] = useState(false);

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

    const onInputValueChange = ({target}: React.ChangeEvent<HTMLInputElement>) => {
        const targetValue = target.value;
        setInputValue(targetValue);

        if (onChange) {
            onChange(targetValue);
        }
    }

    const onInputBlur = () => {
        setPickerOpen(false);
        if (onBlur) {
            onBlur();
        }
    }

    const getLabelClassName = () => classNames('label-span', {
        'body2': !inputValue,
        'body3': inputValue
    });

    return (<div className={classNames('time-picker relative w-full flex flex-col h-20', {'time-picker-disabled': props.disabled})}>
        <div className={classNames('time-picker-container relative flex flex-wrap')}>
            <input
                name={name}
                type='time'
                onChange={onInputValueChange}
                onBlur={onInputBlur}
                onFocus={() => setPickerOpen(true)}
                data-test-id={dataTestId}
                className={`w-px pl-4 body2 relative truncate flex-shrink flex-grow flex-auto leading-normal ${getInputClassName()}`}
                value={inputValue}
                disabled={props.disabled}
            />
            {label &&
                <label className='absolute truncate'>
                    {props.required && !props.disabled &&
                        <span className='text-danger'>*</span>
                    }
                    <span className={getLabelClassName()}>{t(label)}</span>
                </label>
            }
            <div
                role="button"
                className={classNames('input-addon px-3', {'pt-3': !label, 'pt-4': !!label})}
                onMouseDown={(event) => event.preventDefault()}
            >
                <SvgIcon type={isPickerOpen ? Icon.ArrowUp : Icon.ArrowDown} fillClass='time-picker-arrow' />
            </div>
        </div>
        {props.assistiveText && !props.error &&
            <div className={getAssistiveTextContainerClassName()}>
                <span className={getAssistiveTextClassName()}>{props.assistiveText}</span>
            </div>
        }
        {props.error &&
            <div className='h6 pl-4 body3 pt-1 text-danger truncate'>{props.error}</div>
        }
    </div>);
}

export default TimePicker;

