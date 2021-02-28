import React, { ChangeEvent, Fragment } from 'react';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    required?: boolean,
    rows?: number,
    error?: string,
    htmlFor?: string,
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}
const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({ label, value, htmlFor, ...props }: TextAreaProps, ref) => {
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block text-sm font-medium text-gray-700'>
                {label}
            </label>
            <textarea ref={ref} {...props} value={value}
                className={'border mt-1 p-4 ' + props.className} />
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default TextArea;
