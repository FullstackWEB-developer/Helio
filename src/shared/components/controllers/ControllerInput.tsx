import {Controller} from 'react-hook-form';
import {Control} from 'react-hook-form/dist/types/form';
import Input from '@components/input/input';
import {useTranslation} from 'react-i18next';

export class InputTypes {
    static Phone =  new RegExp('1?\\W*([2-9][0-8][0-9])\\W*([2-9][0-9]{2})\\W*([0-9]{4})(\\se?x?t?(\\d*))?');
    static Email = new RegExp('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$');
    static Zip = new RegExp('^\\d{5}(?:[-\\s]\\d{4})?$');
}

export interface ControllerInputProps {
    control: Control;
    required?: boolean;
    name: string;
    className?: string;
    label?: string;
    dataTestId:string;
    max?: string;
    type?: 'text' | 'tel' | 'email' | 'date' | 'zip';
}

const ControlledInput = ({control, required = false, type='text', name, label='', className='', dataTestId, max, ...props} : ControllerInputProps) =>  {

    const {t} = useTranslation();
    const requiredText = t('common.required');
    let pattern = undefined;
    if (type === 'tel') {
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
    }

    return ( <Controller
        name={name}
        control={control}
        {...props}
        rules={{
            required : required ? requiredText : '',
            pattern: pattern
        }}
        render={(props) => (
            <Input
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

export default ControlledInput;
