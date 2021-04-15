import React from 'react';
import { useTranslation } from 'react-i18next';
import './button.scss';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean,
    buttonType?: 'small' | 'medium' | 'big' | 'secondary'
}
const Button = ({ label, type = 'button', disabled=false, buttonType = 'medium', ...props }: ButtonProps) => {
    const { t } = useTranslation();
    return (<button disabled={disabled} {...props} className={`${buttonType}-button`} type={type}>{t(label)}</button>
    );
}

export default Button;
