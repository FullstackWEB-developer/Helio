import {Controller, ControllerRenderProps} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import Input, {InputTypes} from '@components/input';
import {useTranslation} from 'react-i18next';
import React from 'react';
import {Option} from '@components/option/option';
import {Icon} from '@components/svg-icon/icon';

export interface ControlledInputProps {
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
    ...props
}: ControlledInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');
    let inputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>): void => undefined;
    let pattern = undefined;
    if (type === 'tel') {
        mask = '(999) 999-9999'
        pattern = {
            value: InputTypes.Phone,
            message: t(invalidErrorMessage ?? 'components.input.invalid_phone')
        }
    } else if (type === 'email') {
        pattern = {
            value: InputTypes.Email,
            message: t(invalidErrorMessage ?? 'components.input.invalid_email')
        }
    } else if (type === 'zip') {
        pattern = {
            value: InputTypes.Zip,
            message: t(invalidErrorMessage ?? 'components.input.invalid_zip')
        }
    }

    const cleanMask = (value?: string) => {
        if (value && !!mask) {
            return value.replace('(', '').replace(' ', '').replace(')', '').replace('-', '').replace(/_*/, '');
        }
        return value;
    }

    const onInputChanged = (event: React.ChangeEvent<HTMLInputElement>, controllerProps: ControllerRenderProps<Record<string, any>>) => {
        const value = cleanMask(event.target.value);

        controllerProps.onChange(type === 'tel' ? value : event);

        if (props.onChange) {
            props.onChange(event);
        }
        control.setValue(name, value, {shouldValidate: true});
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
                forceAutoSuggestSelect={forceAutoSuggestSelect}
                isLoading={props.isLoading}
                disabled={props.disabled}
                data-test-id={dataTestId}
                onKeyDown={inputKeyDown}
                onBlur={props.onBlur || controllerProps.onBlur}
                onChange={(event) => onInputChanged(event, controllerProps)}
                autoSuggestDropdown={props.autosuggestDropdown}
                autoSuggestOptions={props.autosuggestOptions}
                dropdownIconClickHandler={props.dropdownIconClickHandler}
                onDropdownSuggestionClick={props.onDropdownSuggestionClick}
                isFetchingSuggestions={props.isFetchingSuggestions}
                selectedSuggestion={props.selectedSuggestion}
                fetchingSuggestionsPlaceholder={props.fetchingSuggestionsPlaceholder}
                shouldDisplayAutocomplete={props.shouldDisplayAutocomplete}
            />
            );
        }}
    />);
}

export default ControlledInput;
