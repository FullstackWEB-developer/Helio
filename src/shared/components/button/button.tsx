import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import './button.scss';
import Spinner from '@components/spinner/Spinner';
import classNames from 'classnames';

type ButtonType = 'small' | 'medium' | 'big' | 'secondary-big' | 'secondary' | 'secondary-medium' | 'link';
interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
    label: string;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    buttonType?: ButtonType;
    icon?: Icon;
    className?: string;
    isLoading?: boolean
    iconSize?: 'icon-small' | 'icon-medium';
}
const Button = ({label, type = 'button', disabled = false, buttonType = 'medium', icon, className, isLoading, iconSize= 'icon-medium', ...props}: ButtonProps) => {
    const isSecondary =  ['secondary', 'secondary-big', 'secondary-medium'].includes(buttonType);
    
    const determineIconFill = () => {
        if (!disabled && isSecondary) {
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
            return <Spinner size={isButtonSmall() ? 'large' : 'large-40'} />
        }
        if (icon) {
            return <div className='w-6 flex'>
                <SvgIcon type={icon} fillClass={determineIconFill()} className={iconSize} />
            </div>
        }

    }
    return (<><button disabled={disabled || isLoading} {...props} className={`${constructButtonClassString()}`} type={type}>
        <div className={classNames('flex flex-row justify-center items-center', {'space-x-2': !isLoading})}>
            {
                getIcon()
            }
            <div>{isLoading ? '' : t(label)}</div>
        </div>
    </button></>
    );
}

export default Button;
