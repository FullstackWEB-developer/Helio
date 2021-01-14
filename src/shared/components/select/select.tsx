import React, {ChangeEvent} from "react";

interface SelectProps {
    name: string,
    value?: string,
    placeholder?: string,
    options: string[],
    className?: string,
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
}

const Select = ({name, value, placeholder, options, className, onChange}: SelectProps) => {
    return(
        <select
            name={name}
            value={value}
            placeholder={placeholder}
            className={className}
            onChange={onChange}
        >
            {
                options.map((option: string, index) => (
                    <option value={option} key={index}>{option}</option>
                ))
            }
        </select>
    )
}

export default Select;
