import React, { ChangeEvent, Fragment } from 'react';

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
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700'>
                {label}
            </label>
            <input ref={ref} {...props}
                className={'border mt-1 rounded-md p-4 ' + props.className} />
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default Input;
