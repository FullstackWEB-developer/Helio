import React from 'react';
import './button.scss';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean,
    buttonType?: 'small' | 'medium' | 'big' | 'secondary'
}
const Button = ({ label, type = 'button', disabled=false, buttonType = 'medium', ...props }: ButtonProps) => {
    return (<button disabled={disabled} className={`${buttonType}-button`} type={type} {...props}>{label}</button>
    );
}

export default Button;
