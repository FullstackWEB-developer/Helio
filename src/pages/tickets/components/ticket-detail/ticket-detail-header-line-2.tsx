import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import dayjs from 'dayjs';
import TicketDetailRating from '@pages/tickets/components/ticket-detail/ticket-detail-rating';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectFeedLastMessageOn} from '@pages/tickets/store/tickets.selectors';
import {Ticket} from '@pages/tickets/models/ticket';
import updateLocale from 'dayjs/plugin/updateLocale';

const TicketDetailHeaderLine2 = ({ticket, patientOrContactName}: {ticket: Ticket, patientOrContactName: string}) => {
    dayjs.extend(updateLocale);
    dayjs.updateLocale('en', {
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            m: "1 min",
            mm: "%d mins",
            h: "1 h",
            hh: "%d h",
            d: "1 d",
            dd: "%d d",
            M: "1 mo",
            MM: "%d mo",
            y: "1 y",
            yy: "%d y"
        }
    })
    const {t} = useTranslation();
    const feedLastMessageOn = useSelector(selectFeedLastMessageOn);
    const sysdate = Date.now();
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
                <SmallLabel text={dayjs(ticket.dueDate).isBefore(sysdate) ? 'ticket_detail.header.overdue': 'ticket_detail.header.due_in'} 
                value={dayjs().to(dayjs.utc(ticket.dueDate).local())} />}
        </div>
        <div>
            {feedLastMessageOn && <SmallLabel text='ticket_detail.header.last_activity'
                value={dayjs().to(dayjs.utc(feedLastMessageOn).local())} />}
        </div>
        {
            (ticket?.botRating || ticket?.botRating === 0) &&
            <div className='flex flex-row'>
                <div className='pl-6 body-medium'>{t('patient_ratings.bot_ratings')}</div>
                <div className='pl-2'>
                    <TicketDetailRating botRating={ticket.botRating} ticketId={ticket.id!} />
                </div>
            </div>
        }
        {
            ticket?.patientRating && 
            <div className='flex flex-row'>
                <div className='pl-6 body-medium'>{t('patient_ratings.title_singular')}</div>
                <div className='pl-2'>
                    <TicketDetailRating patientRating={ticket.patientRating} ticketId={ticket.id!} />
                </div>
            </div>
        }
    </div>
}

export default TicketDetailHeaderLine2;
