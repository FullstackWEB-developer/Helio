import CircleIcon from '../../../shared/icons/circle-icon';
import {useTranslation} from 'react-i18next';
import {statusCssClassMap, statusTranslationKeyMap} from '../utils/statusUtils';
import {TicketStatuses} from '@pages/tickets/models/ticket.status.enum';

interface TicketStatusDisplayProps {
    status: TicketStatuses,
    iconClass: string,
    labelClass?: string
}

const TicketStatusDisplay = ({status, iconClass, labelClass}: TicketStatusDisplayProps) => {
    const {t} = useTranslation();
    const colorClass = statusCssClassMap[status];
    const statusLabel = statusTranslationKeyMap[status] ? t(statusTranslationKeyMap[status]) : null;

    return <>
        <div className={iconClass}><CircleIcon color={colorClass} /></div>
        <div className={labelClass}>{statusLabel}</div>
    </>
}

export default TicketStatusDisplay;
