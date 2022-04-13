import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
import classNames from 'classnames';
import {useTranslation} from 'react-i18next';
interface ContactInfoFieldProps {
    label?: string;
    value?: string;
    icon?: Icon;
    labelClass?: string;
    valueClass?: string;
    appendix?: boolean;
    appendixLabel?: string;
    appendixValue?: string;
    iconOnClick?: () => void
    onValueClick?: () => void;
    iconFillClass?: string;
    isIconDisabled?: boolean;
    isValueClickDisabled?: boolean;
    isLink?: boolean;
}
const ContactInfoField = ({label, value, icon, appendix, appendixLabel, appendixValue, labelClass, valueClass,
    onValueClick, isValueClickDisabled, isIconDisabled, iconFillClass = 'contact-light-fill', isLink, ...props}: ContactInfoFieldProps) => {

    const {t} = useTranslation();
    const handleClick = () => {
        if (props.iconOnClick) {
            props.iconOnClick();
        }
    }

    const valueWrapperClassName = classNames(`${valueClass ?? 'pl-10 flex'}`, 'whitespace-pre-line', {
        'text-success': !!onValueClick && value !== t('common.not_available'),
        'col-span-7': !(!!valueClass),
    })
    const valueClassName = classNames({
        'text-success cursor-pointer': !!onValueClick && value !== t('common.not_available'),
        'hover:underline': isLink && !!onValueClick && value !== t('common.not_available'),
    })
    return (
        <>
            <div className={`contact-light ${labelClass ? `${labelClass}` : ''}`}>{label}</div>
            <div className={valueWrapperClassName}>
                {icon &&
                    <div className='pr-1'>
                        <SvgIcon disabled={isIconDisabled}
                            fillClass={iconFillClass}
                            className={value === t('common.not_available') || isIconDisabled ? '' : 'cursor-pointer'}
                            type={icon}
                            onClick={handleClick} />
                    </div>}
                <div onClick={() => {if (isValueClickDisabled) return; if (onValueClick) {onValueClick();} }} className={valueClassName}>{value}</div>
                {
                    appendix && appendixLabel && appendixValue && <span className='contact-light pl-4'>{appendixLabel}</span>
                }
                {
                    appendix && appendixValue && <span className='pl-2'>{appendixValue}</span>
                }
            </div>
        </>
    )
}

export default ContactInfoField;
