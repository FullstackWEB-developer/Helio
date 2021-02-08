import React from "react";

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
}
const Button = ({ label, type, ...props }: ButtonProps) => {
    type = type || 'button';
    return (<button className="bg-blue-600 text-white font-bold py-2 px-4 rounded w-36" type={type} {...props}>{label}</button>
    );
}

export default Button;
