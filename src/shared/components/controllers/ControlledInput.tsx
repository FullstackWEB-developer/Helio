import { Controller, ControllerRenderProps } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import Input, { InputType, InputTypes } from '@components/input';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { Option } from '@components/option/option';
import { Icon } from '@components/svg-icon/icon';
import { INPUT_DATE_FORMAT } from '@constants/form-constants';
import { ValidationRule } from 'react-hook-form/dist/types/validator';


export interface ControlledInputProps {
    control: Control;
    required?: boolean;
    name: string;
    mask?: string;
    className?: string;
    label?: string;
    dataTestId?: string;
    max?: number;
    type?: InputType;
    placeholder?: string;
    value?: string;
    defaultValue?: unknown;
    assistiveText?: string;
    disabled?: boolean,
    isLoading?: boolean,
    errorMessage?: string
    invalidErrorMessage?: string
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
    dropdownIcon?: Icon
    autosuggestDropdown?: boolean;
    forceAutoSuggestSelect?: boolean;
    autosuggestOptions?: Option[];
    dropdownIconClickHandler?: () => void;
    onDropdownSuggestionClick?: (suggestion: Option) => void;
    isFetchingSuggestions?: boolean;
    selectedSuggestion?: Option;
    shouldDisplayAutocomplete?: boolean,
    fetchingSuggestionsPlaceholder?: string;
    containerClassName?: string;
    maxLength?: number;
    pattern?: ValidationRule<RegExp>
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
    invalidErrorMessage,
    forceAutoSuggestSelect,
    max,
    placeholder,
    containerClassName,
    maxLength,
    pattern,
    ...props
}: ControlledInputProps) => {

    const { t } = useTranslation();
    const requiredText = t('common.required');
    let inputKeyDown = (): void => undefined;

    switch (type) {
        case 'tel':
            mask = '(999) 999-9999';
            pattern = {
                value: InputTypes.Phone,
                message: t(invalidErrorMessage ?? 'components.input.invalid_phone')
            };
            break;
        case 'email':
            pattern = {
                value: InputTypes.Email,
                message: t(invalidErrorMessage ?? 'components.input.invalid_email')
            };
            break;
        case 'zip':
            maxLength = 5;
            pattern = {
                value: InputTypes.Zip,
                message: t(invalidErrorMessage ?? 'components.input.invalid_zip')
            };
            break;
        case 'ip': {
            pattern = {
                value: InputTypes.Ip,
                message: t(invalidErrorMessage ?? 'components.input.invalid_ip')
            }
            break;
        }
        case 'date': {
            pattern = {
                value: InputTypes.Date,
                message: t(invalidErrorMessage ?? 'components.input.invalid_date')
            }
            break;
        }
        case 'website': {
            pattern = {
                value: InputTypes.Website,
                message: t(invalidErrorMessage ?? 'components.input.invalid_website')
            }
            break;
        }
        case 'timeframe': {
            pattern = {
                value: InputTypes.TimeFrame,
                message: t(invalidErrorMessage ?? 'components.input.invalid_value')
            }
        }
    }

    const cleanMask = (value?: string) => {
        if (value && !!mask) {
            return value.replace('(', '').replace(' ', '').replace(')', '').replace('-', '').replace(/_*/, '');
        }
        return value;
    }

    const onInputDateChanged = (value: string, controllerProps: ControllerRenderProps<Record<string, any>>) => {
        if (value === INPUT_DATE_FORMAT) {
            value = '';
        }
        controllerProps.onChange(value);
        control.setValue(name, value, { shouldValidate: true });

    }
    const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>, controllerProps: ControllerRenderProps<Record<string, any>>) => {
        const value = cleanMask(event.target?.value);
        controllerProps.onChange(type === 'tel' ? value : event);

        if (props.onChange) {
            props.onChange(event);
        }
        control.setValue(name, value, { shouldValidate: true });
    }

    const onBlur = (e: React.FocusEvent<HTMLInputElement>, controllerProps: ControllerRenderProps<Record<string, any>>) => {
        let value = e?.target?.value;
        if (value && !!mask) {
            value = value.replace('(', '').replace(' ', '').replace(')', '').replace('-', '').replace(/_*/, '');
        }
        if (value) {
            control.setValue(name, value.trim(), { shouldValidate: true });
        }
        if (props.onBlur) {
            props.onBlur(e);
        }
        else {
            controllerProps.onBlur();
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
                maxLength={maxLength}
                label={label}
                mask={mask}
                max={max}
                placeholder={placeholder}
                dropdownIcon={props.dropdownIcon}
                className={className}
                error={props.errorMessage || control.formState.errors[name]?.message}
                type={type}
                required={required}
                assistiveText={props.assistiveText}
                forceAutoSuggestSelect={forceAutoSuggestSelect}
                isLoading={props.isLoading}
                disabled={props.disabled}
                data-test-id={dataTestId}
                onKeyDown={inputKeyDown}
                onBlur={(e) => onBlur(e, controllerProps)}
                onChange={(event) => onInputChanged(event, controllerProps)}
                onChangeDate={event => onInputDateChanged(event, controllerProps)}
                autoSuggestDropdown={props.autosuggestDropdown}
                autoSuggestOptions={props.autosuggestOptions}
                dropdownIconClickHandler={props.dropdownIconClickHandler}
                onDropdownSuggestionClick={props.onDropdownSuggestionClick}
                isFetchingSuggestions={props.isFetchingSuggestions}
                selectedSuggestion={props.selectedSuggestion}
                fetchingSuggestionsPlaceholder={props.fetchingSuggestionsPlaceholder}
                shouldDisplayAutocomplete={props.shouldDisplayAutocomplete}
                containerClassName={containerClassName}
            />
            );
        }}
    />);
}

export default ControlledInput;
