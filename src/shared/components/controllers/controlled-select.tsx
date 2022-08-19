import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {Controller, ControllerRenderProps} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';

export interface ControlledSelectProps {
    name: string;
    control: Control;
    label?: string;
    defaultValue?: Option | string;
    autoComplete?: boolean;
    searchQuery?: string;
    options: Option[];
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    onTextChange?: (value: string) => void;
    onSelect?: (option?: Option) => void;
    truncateAssistiveText?: boolean;
    isLoading?: boolean;
    allowClear?: boolean;
}

const ControlledSelect = ({
    control,
    options,
    name,
    label,
    defaultValue = '',
    searchQuery,
    order,
    assistiveText,
    disabled,
    autoComplete,
    className,
    onSelect,
    onTextChange,
    required = false,
    isLoading,
    truncateAssistiveText = false,
    ...props
}: ControlledSelectProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');

    const onSelected = (controllerProps: ControllerRenderProps, option?: Option) => {
        if (option) {
            controllerProps.onChange(option.value);
            if (onSelect) {
                onSelect(option);
            }
        } else {
            controllerProps.onChange();
            if (onSelect) {
                onSelect(undefined);
            }
        }
    }
    return <Controller
        {...props}
        name={name}
        control={control}
        rules={{
            required: required ? requiredText : ''
        }}
        defaultValue={defaultValue}
        render={(controllerProps) => (
            <Select
                {...controllerProps}
                name={name}
                onSelect={(option) => onSelected(controllerProps, option)}
                data-test-id={`${name}-test-id`}
                label={label}
                allowClear={props.allowClear}
                className={className}
                defaultValue={defaultValue}
                truncateAssistiveText={truncateAssistiveText}
                autoComplete={autoComplete}
                options={options}
                required={required}
                searchQuery={searchQuery}
                order={order}
                assistiveText={assistiveText}
                value={controllerProps.value}
                disabled={disabled}
                onTextChange={onTextChange}
                error={control.formState.errors[name]?.message}
                isLoading={isLoading}
            />
        )}
    />;
}
export default ControlledSelect;
