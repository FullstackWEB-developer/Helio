import {Controller, ControllerRenderProps} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import Input from '@components/input/input';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {Option} from '@components/option/option';
import {Icon} from '@components/svg-icon/icon';

export class InputTypes {
    static Phone = new RegExp('1?\\W*([2-9][0-8][0-9])\\W*([2-9][0-9]{2})\\W*([0-9]{4})(\\se?x?t?(\\d*))?');
    static Email = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
    static Zip = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');
}

const blockNumericInvalidChar = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const invalidChars = ['-', '+', 'e'];
    if (invalidChars.includes(event.key)) {
        event.preventDefault();
    }
}

export interface ControllerInputProps {
    control: Control;
    required?: boolean;
    name: string;
    mask?: string;
    className?: string;
    label?: string;
    dataTestId?: string;
    max?: string;
    type?: 'text' | 'tel' | 'email' | 'zip' | 'number';
    placeholder?: string;
    value?: string;
    defaultValue?: unknown;
    assistiveText?: string;
    disabled?: boolean,
    isLoading?: boolean,
    errorMessage?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    dropdownIcon?: Icon
    autosuggestDropdown?: boolean;
    autosuggestOptions?: Option[];
    onDropdownSuggestionClick?: (suggestion: Option) => void;
    isFetchingSuggestions?: boolean;
    selectedSuggestion?: Option;
    fetchingSuggestionsPlaceholder?: string;
}

const ControlledInput = ({
                             control,
                             required = false,
                             type = 'text',
                             name,
                             mask = '',
                             label = '',
                             className = '',
                             dataTestId = name,
                             max,
                             placeholder,
                             ...props
                         }: ControllerInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');
    let inputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => undefined;
    let pattern = undefined;
    if (type === 'tel') {
        mask = '(999) 999-9999'
        pattern = {
            value: InputTypes.Phone,
            message: t('components.input.invalid_phone')
        }
    } else if (type === 'email') {
        pattern = {
            value: InputTypes.Email,
            message: t('components.input.invalid_email')
        }
    } else if (type === 'zip') {
        pattern = {
            value: InputTypes.Zip,
            message: t('components.input.invalid_zip')
        }
    } else if (type === 'number') {
        inputKeyDown = blockNumericInvalidChar;
    }


    const cleanMask = (value?: string) => {
        if (value) {
            return value.replace('(', '').replace(' ', '').replace(')', '').replace('-', '');
        }
    }

    const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>, controllerProps: ControllerRenderProps<Record<string, any>>) => {

        if (type === 'tel') {
            const value = cleanMask(event.target.value);
            controllerProps.onChange(value);
        } else {
            controllerProps.onChange(event);
        }

        if (props.onChange) {
            props.onChange(event);
        }
    }

    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{
            required: required ? requiredText : '',
            pattern: pattern
        }}
        defaultValue={props.defaultValue}
        render={(controllerProps) => {
            return (<Input
                    {...controllerProps}
                    label={label}
                    mask={mask}
                    placeholder={placeholder}
                    dropdownIcon={props.dropdownIcon}
                    className={className}
                    error={props.errorMessage || control.formState.errors[name]?.message}
                    type={type}
                    required={required}
                    assistiveText={props.assistiveText}
                    isLoading={props.isLoading}
                    disabled={props.disabled}
                    data-test-id={dataTestId}
                    onKeyDown={inputKeyDown}
                    onBlur={props.onBlur || controllerProps.onBlur}
                    onChange={(event) => onInputChanged(event, controllerProps)}
                    autosuggestDropdown={props.autosuggestDropdown}
                    autosuggestOptions={props.autosuggestOptions}
                    onDropdownSuggestionClick={props.onDropdownSuggestionClick}
                    isFetchingSuggestions={props.isFetchingSuggestions}
                    selectedSuggestion={props.selectedSuggestion}
                    fetchingSuggestionsPlaceholder={props.fetchingSuggestionsPlaceholder}
                />
            );
        }}
    />);
}

export default ControlledInput;
