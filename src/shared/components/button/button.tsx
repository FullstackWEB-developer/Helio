import React from 'react';
import './button.scss';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
    small?: boolean,
    disabled?: boolean
}
const Button = ({ label, type = 'button', small=false, disabled=false, ...props }: ButtonProps) => {
    return (<button disabled={disabled} className={'bg-primary-500 hover:bg-primary-700 focus:bg-primary-900 active:bg-primary-900 ' + (small ? 'small subtitle3-white' : 'big subtitle2-white')} type={type} {...props}>{label}</button>
    );
}

export default Button;
