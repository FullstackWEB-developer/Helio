import React from 'react';
import './button.scss';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
    small?: boolean,
    disabled?: boolean
}
const Button = ({ label, type, small=false, disabled=false, ...props }: ButtonProps) => {
    type = type || 'button';
    return (<button disabled={disabled} className={'active:bg-primary-700 text-white bg-primary-400 ' + (small ? 'small' : 'big')} type={type} {...props}>{label}</button>
    );
}

export default Button;
