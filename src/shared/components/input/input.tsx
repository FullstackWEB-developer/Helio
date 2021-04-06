import React, {ChangeEvent, Fragment, useState} from 'react';
import {useTranslation} from 'react-i18next';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    error?: string,
    type?: 'text' | 'number' | 'checkbox' | 'date' | 'time' | 'email' | 'tel',
    htmlFor?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, type, htmlFor, ...props }: InputProps, ref) => {
    const { t } = useTranslation();
    const [isFocusedDueDateTime, setIsFocusedDateTime] = useState(false);
    const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocusedDateTime(false);
        if (props.onBlur) {
            props.onBlur(e);
        }
    }
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='body2-medium block'>
                {t(label || '')}
            </label>
            <input ref={ref} {...props}
                   type={isFocusedDueDateTime ? type : 'text'}
                   onFocus={() => {setIsFocusedDateTime(type === 'date' || type === 'time')}}
                   onBlur={(e) => onBlur(e)}
                className={'border mt-1 rounded-md p-4 ' + props.className} />
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default Input;
