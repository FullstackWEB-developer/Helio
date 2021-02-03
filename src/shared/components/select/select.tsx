import React, { ChangeEvent } from "react";

interface SelectProps {
    name?: string,
    value?: string,
    placeholder?: string,
    options: Option[],
    className?: string,
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}

export interface Option {
    value: string,
    label: string
}

const Select = ({ options, ...props }: SelectProps) => {
    return (
        <select
            {...props}
        >
            {
                options.map((option: Option, index) => (
                    <option value={option.value} key={index}>{option.label}</option>
                ))
            }
        </select>
    )
}

export default Select;
