import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import dayjs from 'dayjs';
import TicketDetailRating from '@pages/tickets/components/ticket-detail/ticket-detail-rating';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectFeedLastMessageOn} from '@pages/tickets/store/tickets.selectors';
import {Ticket} from '@pages/tickets/models/ticket';

const TicketDetailHeaderLine2 = ({ticket, patientOrContactName}: {ticket: Ticket, patientOrContactName: string}) => {
    const {t} = useTranslation();
    const feedLastMessageOn = useSelector(selectFeedLastMessageOn);
    const SmallLabel = ({text, value}: {text: string, value: string | undefined}) => {
        return (
            <div className='pl-6'>
                <div className='flex flex-row'>
                    <div className='body-medium pr-2'>{t(text)}</div>
                    <div>{value}</div>
                </div>
            </div>
        )
    }
    return <div className='pl-12 flex flex-row items-center'>
        <div className='pl-10'>
            <TicketStatusDot ticket={ticket} />
        </div>
        <div className='pl-4 body'>
            {ticket.status && t(`tickets.statuses.${(ticket.status)}`)}
        </div>
        <div>
            {patientOrContactName &&
                <SmallLabel text='ticket_detail.header.created_for' value={`${patientOrContactName}`} />}
        </div>
        <div>
            {ticket.dueDate &&
                <SmallLabel text='ticket_detail.header.due_in' value={dayjs().to(dayjs.utc(ticket.dueDate))} />}
        </div>
        <div>
            {feedLastMessageOn && <SmallLabel text='ticket_detail.header.last_activity'
                value={dayjs().to(dayjs.utc(feedLastMessageOn).local())} />}
        </div>
        {
            (ticket?.ratingScore || ticket?.ratingScore === 0) &&
            <div className='flex flex-row'>
                <div className='pl-6 body-medium'>{t('ticket_detail.header.rating')}</div>
                <div className='pl-2'>
                    <TicketDetailRating rating={ticket.ratingScore} />
                </div>
            </div>
        }
    </div>
}

export default TicketDetailHeaderLine2;
