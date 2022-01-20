import EmailLeftMenu from '@pages/email/components/email-left-menu';
import EmailConversation from '@pages/email/components/email-conversation/email-conversation';
import './email.scss'
import {getEnumByType, getLookupValues} from '@pages/tickets/services/tickets.service';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';

const Email = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getLookupValues('TicketReason'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch]);
    
    return <>
        <EmailLeftMenu/>
        <EmailConversation/>
    </>
}

export default  Email;
