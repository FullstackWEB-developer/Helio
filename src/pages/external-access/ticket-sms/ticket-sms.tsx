import {useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {ChannelTypes, PagedList, TicketMessage, TicketMessagesDirection} from '@shared/models';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import {useLocation} from 'react-router-dom';
import Spinner from '@components/spinner/Spinner';
import IncomingSms from '@pages/external-access/ticket-sms/incoming-sms';
import OutgoingSms from '@pages/external-access/ticket-sms/outgoing-sms';
import './ticket-sms.scss';
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isToday from 'dayjs/plugin/isToday';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import TicketSmsSendMessage from '@pages/external-access/ticket-sms/ticket-sms-send-message';
import utils from '@shared/utils/utils';

interface TicketSmsState {
    ticketId: string
}
const TicketSms = () => {
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const { state } = useLocation<TicketSmsState>();
    const [isBottomFocus, setBottomFocus] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [messages, setMessages] = useState<TicketMessage[]>([]);


    useEffect(() => {
        const bodyEl = document.getElementsByTagName('body')[0];
        if (bodyEl.classList.contains('default')) {
            bodyEl.classList.replace('default', 'cwc-theme');
        }
    }, [])

    const {isLoading} = useQuery([QueryTicketMessagesInfinite, ChannelTypes.SMS, state?.ticketId, page],
        () => getMessages(state?.ticketId, ChannelTypes.SMS, {
        page,
        pageSize: 50,
    }), {
        enabled: !!state?.ticketId,
        onSuccess:(data: PagedList<TicketMessage>) => {
            setBottomFocus(true);
            setMessages([...messages].concat(data.results));
            if (page < data.totalPages) {
                setPage(page+1);
            }
        }
    });

    const onMessageSend= (text: string) => {
        const message: TicketMessage = {
            ticketId:state?.ticketId,
            channel: ChannelTypes.SMS,
            body: text,
            createdOn: new Date(),
            isRead: false,
            createdBy: verifiedPatient.patientId.toString(),
            createdName: utils.stringJoin(' ', verifiedPatient.firstName, verifiedPatient.lastName),
            direction: TicketMessagesDirection.Incoming,
            fromAddress:''
        };
        setMessages([...messages, message]);
        setFocus();
    }

    const setFocus = () => {
        setBottomFocus(false);
        setTimeout(() => {
         setBottomFocus(true);
        })
    }

    if (!verifiedPatient) {
        return <div>{t('external_access.hipaa.not_verified_patient')}</div>;
    }

    if (isLoading) {
        return <Spinner fullScreen />
    }

    if (!messages || messages.length === 0) {
        return <div>{t('external_access.ticket_sms.no_messages')}</div>;
    }

    const DisplayMessage = ({message}: {message: TicketMessage}) => {
        return message.direction === TicketMessagesDirection.Incoming ? <IncomingSms message={message} /> : <OutgoingSms message={message} />
    }

    const getDate = (date: Date) => {
        if (dayjs.utc(date).local().isToday()) {
            return t("external_access.ticket_sms.today");
        }
        if (dayjs.utc(date).local().isYesterday()) {
            return t("external_access.ticket_sms.yesterday");
        }
        return dayjs.utc(date).local().format('MMMM DD, YYYY');
    }

    const shouldPrintDate = (message: TicketMessage, previousMessage: TicketMessage | undefined) : boolean => {
        if (!previousMessage) {
            return true;
        }
        return !dayjs.utc(message.createdOn).local().isSame(dayjs.utc(previousMessage.createdOn).local(), 'day');
    }

    const sortedMessages = messages.sort((a,b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());

return <div className='flex flex-col min-h-screen'>
    <div className='h7 border-b w-ful flex items-center justify-center h-14 flex-none'>
        {t('external_access.ticket_sms.conversation_history')}
    </div>
    <div className='overflow-y-auto flex-grow space-y-4 pb-6'>
        {sortedMessages.map((message, index) => {
            const previousMessage = sortedMessages[index-1];
            if (shouldPrintDate(message, previousMessage)) {
                return <>
                    <div className='body3-small pt-2 flex justify-center'>
                        {getDate(message.createdOn)}
                    </div>
                    <DisplayMessage message={message} key={new Date(message.createdOn).toISOString()} />
                </>
            } else {
                return <DisplayMessage message={message} key={new Date(message.createdOn).toISOString()} />
            }
        })}
        <AlwaysScrollToBottom enabled={isBottomFocus}/>
    </div>
    <TicketSmsSendMessage ticketId={state.ticketId} onMessageSend={(text) => onMessageSend(text)} />
</div>
}

export default TicketSms;
