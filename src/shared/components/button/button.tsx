import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import './button.scss';

type ButtonType = 'small' | 'medium' | 'big' | 'secondary-big' | 'secondary' | 'link';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string,
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean,
    buttonType?: ButtonType,
    icon?: Icon,
    className?: string
}
const Button = ({label, type = 'button', disabled = false, buttonType = 'medium', icon, className, ...props}: ButtonProps) => {

    const isSecondary = buttonType === 'secondary' || 'secondary-big';
    const determineIconPosition = () => {
        return `${buttonType === 'small' || buttonType === isSecondary ? ' top-1 ' : ' align-middle '}`;
    }
    const determineIconFill = () => {
        if (!disabled && buttonType === isSecondary) {
            return `green-icon-fill`;
        }
        return `${disabled ? 'disa' : 'ena'}bled-icon-fill`;
    }
    const {t} = useTranslation();

    const constructButtonClassString = () => {
        let buttonClassName = `${buttonType}-button`;
        if (className) {
            buttonClassName += ` ${className}`;
        }       
        return buttonClassName;
    }
    return (<button disabled={disabled} {...props} className={`${constructButtonClassString()}`} type={type}>
        {
            icon && <div className={`h-6 w-6 inline-flex absolute${determineIconPosition()}left-4`}><SvgIcon type={icon} fillClass={determineIconFill()} /></div>
        }
        <span className={`${icon ? 'pl-3.5' : ''}`}>{t(label)}</span>
    </button>
    );
}

export default Button;
