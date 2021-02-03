import React, { ChangeEvent, Fragment } from "react";

interface InputProps extends React.HTMLAttributes<HTMLElement> {
    id?: string,
    name?: string,
    value?: string,
    label?: string,
    type?: 'text' | 'number'| 'checkbox' | 'date' | 'time' | 'week' | 'month' | 'email' | 'url' | 'color' | undefined,
    htmlFor?: string,
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}
const Input = ({ label, htmlFor, ...props }: InputProps) => {
    return (
        <Fragment>
            <label htmlFor={htmlFor} className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <input {...props}
               className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md" />
        </Fragment>
    );
}

export default Input;
