import SvgIcon, {Icon} from '@components/svg-icon';
import React from 'react';
import {useTranslation} from 'react-i18next';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
import './ticket-created-for-hover-label.scss';

export interface TicketCreatedForHoverLabelProps {
    label: string;
    isActive: boolean;
    icon?: Icon;
    linkText?: string;
    onClick?: () => void;
    suffix?: React.ReactNode;
}

const TicketCreatedForHoverLabel = ({label, isActive, icon, linkText, onClick, suffix} : TicketCreatedForHoverLabelProps) => {
    const {t} = useTranslation();
    return <div className='flex flex-row'>
        <div className='w-36 body2'>{t(label)}</div>
        {icon && <div className='w-10'>
            <SvgIcon className={isActive ? 'cursor-pointer' : ''} type={icon} fillClass={isActive ? 'success-icon' : ''} disabled={!isActive} onClick={() => onClick && onClick()} />
        </div>}
        <div className={isActive ? 'body2-primary cursor-pointer' : 'body2'} onClick={() => isActive && onClick && onClick()}>
            <ElipsisTooltipTextbox value={linkText || 'common.not_available'}
                                   asSpan={false}
                                   classNames='ticket-created-for-hover-label-text'
                                   isDefaultTextClass={false} />
        </div>
        {suffix}
    </div>
}

export default TicketCreatedForHoverLabel;
