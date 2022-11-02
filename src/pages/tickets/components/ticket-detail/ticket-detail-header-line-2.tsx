import TicketStatusDot from '@pages/tickets/components/ticket-status-dot';
import dayjs from 'dayjs';
import TicketDetailRating from '@pages/tickets/components/ticket-detail/ticket-detail-rating';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
import {selectFeedLastMessageOn} from '@pages/tickets/store/tickets.selectors';
import {Ticket} from '@pages/tickets/models/ticket';
import updateLocale from 'dayjs/plugin/updateLocale';
import {DAYJS_LOCALE} from '@pages/email/constants';
import { Link } from 'react-router-dom';
import './ticket-detail-header-line-2.scss';

const TicketDetailHeaderLine2 = ({ticket, patientOrContactName, createdForType, userId}: {ticket: Ticket, patientOrContactName: string, createdForType: 'Contact' | 'Patient' | undefined, userId: string}) => {
    dayjs.extend(updateLocale);
    dayjs.updateLocale('en', DAYJS_LOCALE);
    const {t} = useTranslation();
    const feedLastMessageOn = useSelector(selectFeedLastMessageOn);
    const sysdate = Date.now();
    const SmallLabel = ({text, value, link}: {text: string, value: string | undefined, link?: boolean}) => {
        return (
            <div className='pl-6'>
                <div className='flex flex-row'>
                    <div className='body-medium pr-1'>{t(text)}</div>
                    <div>{link ? <Link to={getURL()} className={"ticket-detail-header-line-2-created-for-link body-medium"}>{value}</Link> : value}</div>
                </div>
            </div>
        )
    }
    const getURL = () => {
        if(createdForType === 'Contact') {
            return '/contacts/' + userId
        } else if(createdForType === 'Patient') {
            return '/patients/' + userId
        } else {
            return ''
        }
    }
    const getCreatedForLabel = () => {
        if(createdForType === 'Contact') {
            return 'ticket_detail.header.created_for_contact'
        } else if(createdForType === 'Patient') {
            return 'ticket_detail.header.created_for_patient'
        } else {
            return 'ticket_detail.header.created_for'
        }
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
                <SmallLabel text={getCreatedForLabel()} value={`${patientOrContactName}`} link={true} />}
        </div>
        <div>
            {ticket.dueDate &&
                <SmallLabel text={dayjs.utc(ticket.dueDate).local().isBefore(sysdate) ? 'ticket_detail.header.overdue': 'ticket_detail.header.due_in'}
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
