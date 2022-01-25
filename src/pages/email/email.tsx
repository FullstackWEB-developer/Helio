import dayjs from 'dayjs';
import EmailConversation from '@pages/email/components/email-conversation/email-conversation';
import './email.scss'
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router';
import {EMPTY_GUID} from '@pages/email/constants';
import NewEmail from '@pages/email/components/new-email/new-email';
import {TicketMessageSummary, TicketType} from '@shared/models';
import {TicketBase} from '@pages/tickets/models/ticket-base';
import EmailLeftMenu from '@pages/email/components/email-left-menu';
import {useTranslation} from 'react-i18next';

const Email = () => {

    const dispatch = useDispatch();
    const {ticketId} = useParams<{ticketId: string}>();
    const [messageSummaries, setMessageSummaries] = useState<TicketMessageSummary[]>([]);
    const {t} = useTranslation();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

    const onNewTicketCreated = (ticket: TicketBase)=> {
        const existingMessage = messageSummaries.find(a => a.ticketId === ticket.id);
        if (existingMessage) {
            const index = messageSummaries.indexOf(existingMessage);
            existingMessage.messageCreatedOn = dayjs().local().toDate();
            const messages = [...messageSummaries.slice(0, index), Object.assign({}, messageSummaries[index], messageSummaries.slice(index + 1))];
            setMessageSummaries(messages);
        } else {
            const message: TicketMessageSummary = {
                ticketId: ticket.id,
                patientId: ticket.patientId,
                contactId: ticket.contactId,
                createdForName: ticket.createdForName,
                ticketNumber: ticket.ticketNumber,
                reason: ticket.reason,
                messageSummary: t('email.new_email.draft'),
                unreadCount: 0,
                messageCreatedOn: dayjs().local().toDate(),
                messageCreatedByName: '',
                ticketType: ticket.type,
                createdForEndpoint: ''

            }
            const messages = [...messageSummaries, message];
            setMessageSummaries(messages);
        }
    }
    
    return <>
        <EmailLeftMenu messageSummaries={messageSummaries} setMessageSummaries={setMessageSummaries}/>
        {ticketId === EMPTY_GUID ? <NewEmail newEmailCreated={onNewTicketCreated}/>: <EmailConversation/>}
    </>
}

export default  Email;
