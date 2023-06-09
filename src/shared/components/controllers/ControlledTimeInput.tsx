import {Controller} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import {useTranslation} from 'react-i18next';
import TimePicker from '@components/time-picker';
export interface ControllerTimeInputProps {
    control: Control;
    required?: boolean;
    disabled?: boolean;
    name: string;
    className?: string;
    label?: string;
    dataTestId: string;
    defaultValue?: string | undefined;
    value?: string | undefined;
    autoComplete?: boolean;
    onChange?: (time: string | undefined) => void;
    minTime?: string;
}

const ControlledTimeInput = ({control,
    required,
    disabled,
    name,
    label,
    dataTestId,
    defaultValue,
    value,
    autoComplete,
    minTime,
    ...props
}: ControllerTimeInputProps) => {

    const {t} = useTranslation();
    const requiredText = t('common.required');

    const onChange = (value: string | undefined) => {
        control.setValue(name, value, {
            shouldValidate: true
        });

        if (props.onChange) {
            props.onChange(value);
        }
    }

    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{required: required ? requiredText : ''}}
        defaultValue={defaultValue}
        render={(controllerProps) => (
            <TimePicker
                {...controllerProps}
                label={label}
                value={value}
                required={required}
                disabled={disabled}
                dataTestId={dataTestId}
                autoComplete={autoComplete}
                error={control.formState.errors[name]?.message}
                onChange={onChange}
                minTime={minTime}
            />
        )}
    />);
}

export default ControlledTimeInput;
