import EmailLeftMenu from '@pages/email/components/email-left-menu';
import EmailConversation from '@pages/email/components/email-conversation/email-conversation';
import './email.scss'
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {useParams} from 'react-router';
import {EMPTY_GUID} from '@pages/email/constants';
import NewEmail from '@pages/email/components/new-email/new-email';

const Email = () => {

    const dispatch = useDispatch();
    const {ticketId} = useParams<{ticketId: string}>();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);
    
    return <>
        <EmailLeftMenu/>
        {ticketId === EMPTY_GUID ? <NewEmail/>: <EmailConversation/>}
    </>
}

export default  Email;
