import {useDispatch, useSelector} from 'react-redux';
import {selectVerifiedPatent} from '@pages/patients/store/patients.selectors';
import React, {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useQuery} from 'react-query';
import {QueryTicketMessagesInfinite, UserListBaseData} from '@constants/react-query-constants';
import {ChannelTypes, PagedList, TicketMessage, TicketMessagesDirection} from '@shared/models';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
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
import {getUserBaseData} from '@shared/services/user.service';
import {selectRedirectLink} from '@pages/external-access/verify-patient/store/verify-patient.selectors';
import {selectTicketSmsMessages} from '@pages/external-access/ticket-sms/store/ticket-sms.selectors';
import {setTicketSmsMessages} from '@pages/external-access/ticket-sms/store/ticket-sms.slice';

const TicketSms = () => {
    dayjs.extend(isToday);
    dayjs.extend(isYesterday);
    const {t} = useTranslation();
    const verifiedPatient = useSelector(selectVerifiedPatent);
    const request = useSelector(selectRedirectLink);
    const [isBottomFocus, setBottomFocus] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const [userIds, setUserIds] = useState<string[]>();
    const messages = useSelector(selectTicketSmsMessages);
    const dispatch = useDispatch();
    useEffect(() => {
        const bodyEl = document.getElementsByTagName('body')[0];
        if (bodyEl.classList.contains('default')) {
            bodyEl.classList.replace('default', 'cwc-theme');
        }
        setBottomFocus(false);
    }, [])

    const {isLoading} = useQuery([QueryTicketMessagesInfinite, ChannelTypes.SMS, request?.ticketId, page],
        () => getMessages(request.ticketId, ChannelTypes.SMS, {
            page,
            pageSize: 50,
        }), {
        enabled: !!request?.ticketId,
        onSuccess: (data: PagedList<TicketMessage>) => {
            setBottomFocus(true);
            let allMessages = [...messages].concat(data.results);

            dispatch(setTicketSmsMessages(allMessages));
            if (page < data.totalPages) {
                setPage(page + 1);
            } else {
                let userIds = allMessages.map(message => message.createdBy);
                userIds = userIds
                    .filter(function (v, i) {return userIds.indexOf(v) === i;})
                    .filter(a => utils.isGuid(a));
                setUserIds(userIds);
            }
        }
    });

    useEffect(() => {
        let newUserIds = messages.map(message => message.createdBy);
        newUserIds = newUserIds
            .filter(function (v, i) {return newUserIds.indexOf(v) === i;})
            .filter(a => utils.isGuid(a));
        if (userIds && userIds.length !== newUserIds.length) {
            refetchUsers().then();
        }
        setUserIds(userIds);
        setFocus();
    }, [messages])

    const {data: users, refetch: refetchUsers} = useQuery([UserListBaseData, userIds],
        () => {
            return getUserBaseData(userIds!, {
                page: 1,
                pageSize: 100,
            })
        }, {
        enabled: !!userIds && userIds.length > 0
    });

    const sortedMessages = useMemo(() => {
        return [...messages].sort((a, b) => new Date(a.createdOn).getTime() - new Date(b.createdOn).getTime());
    }, [messages]);

    const onMessageSend = (text: string) => {
        const message: TicketMessage = {
            ticketId: request.ticketId,
            channel: ChannelTypes.SMS,
            body: text,
            createdOn: new Date(),
            isRead: false,
            createdBy: verifiedPatient?.patientId ? String(verifiedPatient.patientId) : 'Anonymous',
            createdByName: verifiedPatient ? utils.stringJoin(' ', verifiedPatient.firstName, verifiedPatient.lastName): 'Anonymous',
            direction: TicketMessagesDirection.Incoming,
            fromAddress: ''
        };
        dispatch(setTicketSmsMessages([...messages, message]));
        setFocus();
    }

    const setFocus = () => {
        setBottomFocus(false);
        setTimeout(() => {
            setBottomFocus(true);
        })
    }

    if (request?.patientId && !verifiedPatient) {
        return <div>{t('external_access.not_verified_patient')}</div>;
    }

    if (isLoading) {
        return <Spinner fullScreen />
    }



    const DisplayMessage = ({message}: {message: TicketMessage}) => {
        return message.direction === TicketMessagesDirection.Incoming ? <IncomingSms message={message} /> : <OutgoingSms users={users?.results} message={message} />
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

    const shouldPrintDate = (message: TicketMessage, previousMessage: TicketMessage | undefined): boolean => {
        if (!previousMessage) {
            return true;
        }
        return !dayjs.utc(message.createdOn).local().isSame(dayjs.utc(previousMessage.createdOn).local(), 'day');
    }

    return <div className='flex flex-col min-h-screen'>
        <div className='h7 border-b w-ful flex items-center justify-center h-14 flex-none'>
            {t('external_access.ticket_sms.conversation_history')}
        </div>
        <div className='overflow-y-auto flex-grow space-y-4 pb-6'>
            {(!messages || messages.length === 0) && <div className='pt-4 body2-medium flex justify-center'>{t('external_access.ticket_sms.no_messages')}</div>}
            {React.Children.toArray(sortedMessages.map((message, index) => {
                const previousMessage = sortedMessages[index - 1];
                if (shouldPrintDate(message, previousMessage)) {
                    return <>
                        <div className='body3-small pt-2 flex justify-center'>
                            {getDate(message.createdOn)}
                        </div>
                        <DisplayMessage message={message} />
                    </>
                } else {
                    return <DisplayMessage message={message} />
                }
            }))}
            <AlwaysScrollToBottom enabled={isBottomFocus} />
        </div>
        <TicketSmsSendMessage ticketId={request?.ticketId} onMessageSend={(text) => onMessageSend(text)} />
    </div>
}

export default TicketSms;
