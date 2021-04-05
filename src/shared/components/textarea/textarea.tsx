import React, {ChangeEvent, Fragment} from 'react';

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
    id?: string;
    name?: string;
    value?: string;
    label?: string;
    required?: boolean;
    rows?: number;
    error?: string;
    htmlFor?: string;
    hasBorder?: boolean;
    resizable?: boolean;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(({
                                                                           label,
                                                                           value,
                                                                           htmlFor,
                                                                           hasBorder = true,
                                                                           resizable = true,
                                                                           ...props
                                                                       }: TextAreaProps, ref) => {
    return (
        <Fragment>
            <label htmlFor={htmlFor} className='block subtitle'>
                {label}
            </label>
            <textarea ref={ref} {...props} value={value}
                      className={`mt-1 shadow-none p-4 ${(hasBorder ? ' border ' : '')} ${resizable ? 'resize' : 'resize-none'} ${props.className}`}/>
            {props.error && <div className='text-red-500'>{props.error}</div>}
        </Fragment>
    );
})

export default TextArea;
