import { Controller } from 'react-hook-form';
import { Control } from 'react-hook-form/dist/types/form';
import { useTranslation } from 'react-i18next';
import DateTimeInput from '@components/date-time-input/date-time-input';

export interface ControllerInputProps {
    control: Control;
    required?: boolean;
    name: string;
    className?: string;
    label?: string;
    dataTestId: string;
    max?: string;
    type?: 'date' | 'time';
    placeholder?: string;
}

const ControlledDateInput = ({control, required = false, type = 'date', name, label = '', className = '', dataTestId, max, placeholder, ...props }: ControllerInputProps) => {

    const { t } = useTranslation();
    const requiredText = t('common.required');


    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{
            required: required ? requiredText : ''
        }}
        render={(controllerProps) => (
            <DateTimeInput
                label={label}
                {...controllerProps}
                max={max}
                className={className}
                data-test-id={dataTestId}
                error={control.formState.errors[name]?.message}
                type={type}
                placeholder={placeholder}
            />
        )}
    />);
}

export default ControlledDateInput;
