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
}

const ControlledDateInput = ({ control, required = false, type = 'date', name, label = '', className = '', dataTestId, max, ...props }: ControllerInputProps) => {

    const { t } = useTranslation();
    const requiredText = t('common.required');


    return (<Controller
        name={name}
        control={control}
        {...props}
        rules={{
            required: required ? requiredText : ''
        }}
        render={(props) => (
            <DateTimeInput
                label={label}
                {...props}
                max={max}
                className={className}
                data-test-id={dataTestId}
                error={control.formState.errors[name]?.message}
                type={type}
            />
        )}
    />);
}

export default ControlledDateInput;
