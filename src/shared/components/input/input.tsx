import React, {ChangeEvent, Fragment, useState} from 'react';

interface InputProps extends React.HTMLAttributes<HTMLInputElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    error?: string,
    type?: 'text' | 'number' | 'checkbox' | 'date' | 'time' | 'email',
    htmlFor?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
const Input = React.forwardRef<HTMLInputElement, InputProps>(({ label, htmlFor, ...props }: InputProps, ref) => {
    const [isFocusedDueDateTime, setIsFocusedDateTime] = useState(false);

    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block'>
                {label}
            </label>
            <input ref={ref} {...props}
                   type={isFocusedDueDateTime ? props.type : 'text'}
                   onFocus={() => {setIsFocusedDateTime(props.type === 'date' || props.type === 'time')}}
                   onBlur={() => {setIsFocusedDateTime(false)}}
                className={'border mt-1 rounded-md p-4 ' + props.className} />
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default Input;
