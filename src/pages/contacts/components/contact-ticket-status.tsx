import {Fragment} from 'react';
import CircleIcon from '../../../shared/icons/circle-icon';
import {useTranslation} from 'react-i18next';

interface ContactTicketStatusDisplayProps {
    status?: number,
    iconClass: string,
    labelClass?: string
}
const ContactTicketStatusDisplay = ({status, iconClass, labelClass}: ContactTicketStatusDisplayProps) => {
    const {t} = useTranslation();

    let colorClass: string;
    switch (status) {
        case 1:
            colorClass = 'text-yellow-300';
            break;
        case 2:
            colorClass = 'text-red-400';
            break;
        case 3:
            colorClass = 'text-gray-300';
            break;
        case 4:
            colorClass = 'text-green-300';
            break;
        case 5:
            colorClass = 'text-green-300';
            break;
        default:
            colorClass = 'text-gray-300';
            break;
    }

    const statuses = [t('tickets.statuses.open'), t('tickets.statuses.on_hold'), t('tickets.statuses.in_progress'), t('tickets.statuses.solved'), t('tickets.statuses.closed')];

    return <Fragment>
        <div className={iconClass}><CircleIcon color={colorClass} /></div>
        <div className={labelClass}>{status ? statuses[status - 1] : null}</div>
    </Fragment>
}

export default ContactTicketStatusDisplay;
