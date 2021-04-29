import {Icon} from '@components/svg-icon/icon';
import SvgIcon from '@components/svg-icon/svg-icon';
import React from 'react';
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
}
const ContactInfoField = ({label, value, icon, appendix, appendixLabel, appendixValue, labelClass, valueClass, ...props}: ContactInfoFieldProps) => {
    const handleClick = () => {
        if(props.iconOnClick){
            props.iconOnClick();
        }
    }
    return (
        <>
            <div className={`contact-light ${labelClass ? `${labelClass}` : ''}`}>{label}</div>
            <div className={`pl-10 flex ${valueClass ? `${valueClass}` : 'col-span-7'}`}>
                {icon && <div className='pr-1'><SvgIcon fillClass='contact-light-fill' className='cursor-pointer' type={icon} onClick={handleClick} /></div>}
                {value}
                {
                    appendix && appendixLabel && <span className='contact-light pl-4'>{appendixLabel}</span>

                }
                {
                    appendix && appendixValue && <span className='pl-2'>{appendixValue}</span>
                }
            </div>
        </>
    )
}

export default ContactInfoField;