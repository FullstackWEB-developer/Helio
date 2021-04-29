import React from 'react';
import SvgIcon from '../svg-icon/svg-icon';
import {Icon} from '../svg-icon/icon';
import {useTranslation} from 'react-i18next';
interface RemoveCTAProps {
    onClick?: () => void
}
const RemoveCTA = ({onClick}: RemoveCTAProps) => {
    const {t} = useTranslation();
    return (
        <div className='flex items-center cursor-pointer' onClick={onClick}>
            <div className='pl-4 pr-2'>
                <SvgIcon type={Icon.Clear} fillClass='contact-light-fill' />
            </div>
            <span className='body2'>
                {t(`common.remove`)}
            </span>
        </div>
    )
}

export default RemoveCTA;