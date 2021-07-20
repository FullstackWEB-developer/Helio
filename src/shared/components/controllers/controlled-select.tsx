import Select from '@components/select/select';
import {Option} from '@components/option/option';
import {Controller, ControllerRenderProps} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';

export interface ControlledSelectProps {
    name: string;
    control: Control;
    label?: string;
    value?: Option | string;
    defaultValue?: Option | string;
    autoComplete?: boolean;
    searchQuery?: string;
    options: Option[];
    order?: boolean;
    assistiveText?: string;
    disabled?: boolean;
    required?: boolean;
    onTextChange?: (value: string) => void;
    onSelect?: (option?: Option) => void
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
    onSelect,
    onTextChange,
    required = false,
    ...props
}: ControlledSelectProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');

    const onSelected = (controllerProps: ControllerRenderProps, option?: Option) => {
        if (option) {
            if (onSelect) {
                onSelect(option);
            }
            controllerProps.onChange(option.value);
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
                onSelect={(option) => onSelected(controllerProps, option)}
                data-test-id={`${name}-test-id`}
                label={label}
                defaultValue={defaultValue}
                autoComplete={autoComplete}
                options={options}
                required={required}
                searchQuery={searchQuery}
                order={order}
                assistiveText={assistiveText}
                value={props.value}
                disabled={disabled}
                onTextChange={onTextChange}
                error={control.formState.errors[name]?.message}
            />
        )}
    />;
}
export default ControlledSelect;
