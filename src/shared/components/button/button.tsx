import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import './button.scss';
import Spinner from '@components/spinner/Spinner';

type ButtonType = 'small' | 'medium' | 'big' | 'secondary-big' | 'secondary' | 'secondary-medium' | 'link' ;
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    buttonType?: ButtonType;
    icon?: Icon;
    className?: string;
    isLoading?: boolean;
}
const Button = ({label, type = 'button', disabled = false, buttonType = 'medium', icon, className, isLoading, ...props}: ButtonProps) => {
    const isSecondary = buttonType === 'secondary' || 'secondary-big' || 'secondary-medium';
    const determineIconPosition = () => {
        return `${buttonType === 'small' || buttonType === isSecondary ? ' top-1 ' : ' align-middle '}`;
    }
    const determineIconFill = () => {
        if (!disabled && buttonType === isSecondary) {
            return `green-icon-fill`;
        }
        return `${disabled ? 'disabled' : 'enabled'}-icon-fill`;
    }
    const {t} = useTranslation();
    const constructButtonClassString = () => {
        let buttonClassName = `${buttonType}-button`;
        if (className) {
            buttonClassName += ` ${className}`;
        }
        if (isLoading) {
            buttonClassName += ` loading`;
        }
        return buttonClassName;
    }

    const isButtonSmall = () => {
        return buttonType === 'small' || buttonType === 'secondary';
    }

    const getIcon = () => {
        if (isLoading) {
            return <Spinner size={isButtonSmall() ? 'large' : 'large-40'}/>
        }
        if (icon) {
            return <div className={`h-6 w-6 inline-flex ${determineIconPosition()}`}>
                <SvgIcon type={icon} fillClass={determineIconFill()}/>
            </div>
        }

    }
    return (<><button disabled={disabled || isLoading} {...props} className={`${constructButtonClassString()}`} type={type}>
            <div className='flex flex-row space-x-2 justify-center items-center'>
                {
                    getIcon()
                }
                <div>{isLoading ? '' :  t(label)}</div>
            </div>
    </button></>
    );
}

export default Button;
