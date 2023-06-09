import EmailConversation from '@pages/email/components/email-conversation/email-conversation';
import './email.scss'
import {getEnumByType} from '@pages/tickets/services/tickets.service';
import { getLookupValues } from '@shared/services/lookups.service';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router';
import {NEW_EMAIL} from '@pages/email/constants';
import NewEmail from '@pages/email/components/new-email/new-email';
import {TicketType} from '@shared/models';
import EmailLeftMenu from '@pages/email/components/email-left-menu';
import EmailProvider from './context/email-context';

const Email = () => {

    const dispatch = useDispatch();
    const {ticketId} = useParams<{ticketId: string}>();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);

    
    return <EmailProvider>
                <EmailLeftMenu />
                {ticketId === NEW_EMAIL ? <NewEmail/>: <EmailConversation/>}
           </EmailProvider>
}

export default  Email;
