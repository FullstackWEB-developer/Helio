import React, {useEffect, useRef, useState} from 'react';
import Spinner from '@components/spinner/Spinner';
import {
    GetContactById,
    GetPatient,
    GetPatientPhoto,
    QueryTicketMessagesInfinite,
    QueryTickets
} from '@constants/react-query-constants';
import {getTicketById} from '@pages/tickets/services/tickets.service';
import {useInfiniteQuery, useMutation, useQuery} from 'react-query';
import {useParams} from 'react-router';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import {getMessages, markRead} from '@pages/sms/services/ticket-messages.service';
import {ChannelTypes, EmailMessageDto, TicketMessagesDirection} from '@shared/models';
import {DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/sms/constants';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import EmailMessage from '@pages/email/components/email-message/email-message';
import ConversationHeader from '@components/conversation-header/conversation-header';
import SendFirstEmail from '@pages/email/components/send-first-email/send-first-email';
import {getContactById} from '@shared/services/contacts.service';
import EmailReply from '@pages/email/components/email-message/email-reply';
import {removeUnreadEmailTicketId} from '@pages/email/store/email-slice';
import {useDispatch, useSelector} from 'react-redux';
import {selectUnreadEmails} from '@pages/email/store/email.selectors';
import Alert from '@components/alert/alert';
import NewEmailHeader from '@pages/email/components/new-email/components/new-email-header';

const EmailConversation = () => {
    const {ticketId} = useParams<{ticketId: string}>();
    const dispatch = useDispatch();
    const unreadEmailIds = useSelector(selectUnreadEmails);
    const [emailDisabledText, setEmailDisabledText] = useState<string>();
    const {data: ticket, refetch: refetchTicket} = useQuery([QueryTickets, ticketId], () => getTicketById(ticketId!), {
        enabled: !!ticketId
    });

    const {data: patientPhoto} = useQuery([GetPatientPhoto, ticket?.patientId], () => getPatientPhoto(ticket?.patientId!), {
        enabled: !!ticket?.patientId
    });

    const {data: patient} = useQuery([GetPatient, ticket?.patientId], () => getPatientByIdWithQuery(ticket?.patientId), {
        enabled: !!ticket?.patientId
    });

    const {data: contact} = useQuery([GetContactById, ticket?.contactId], () => getContactById(ticket?.contactId), {
        enabled: !!ticket?.contactId
    });


    const [messages, setMessages] = useState<EmailMessageDto[]>([]);
    const messageListContainerRef = useRef<HTMLDivElement>(null);
    const markReadMutation = useMutation(({ticketId, channel}: {ticketId: string, channel: ChannelTypes}) => markRead(ticketId, channel, TicketMessagesDirection.Incoming), {
        onSettled: () => {
            dispatch(removeUnreadEmailTicketId(ticketId));
        }
    });

    useEffect(() => {
        if (unreadEmailIds.find(a => a.ticketId === ticketId)) {
            emailMessagesQueryRefetch().then()
        }
    }, [unreadEmailIds])


    useEffect(() =>{
        if (!messages || messages.length === 0) {
            return;
        }
        const lastMessage = messages[messages.length - 1];
        const lastEmailAddress = lastMessage.direction === TicketMessagesDirection.Outgoing ? lastMessage.toAddress : lastMessage.fromAddress;
        if (patient) {
            if (patient.emailAddress !== lastEmailAddress) {
                setEmailDisabledText(undefined);
                //setEmailDisabledText('email.inbox.email_not_available_patient') //Undo when 4552 approved
            } else {
                setEmailDisabledText(undefined);
            }
        } else if (contact) {
            if (contact.emailAddress !== lastEmailAddress) {
                setEmailDisabledText(undefined);                
                //setEmailDisabledText('email.inbox.email_not_available_contact') //Undo when 4552 approved
            } else {
                setEmailDisabledText(undefined);
            }
        } else {
            setEmailDisabledText(undefined);
        }

    },[patient, contact, messages]);

    const {
        refetch: emailMessagesQueryRefetch,
        isLoading: emailMessagesQueryIsLoading,
        isFetchingNextPage: isFetchingEmailMessagesNextPage,
        fetchNextPage: fetchEmailMessagesNextPage,
        hasNextPage: emailMessageHasNextPage,
        isFetching
    } = useInfiniteQuery([QueryTicketMessagesInfinite],
        ({pageParam = 1}) => getMessages(ticketId || '', ChannelTypes.Email, {...DEFAULT_MESSAGE_QUERY_PARAMS, page: pageParam}),
        {
            enabled: !!ticketId,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                setMessages(utils.accumulateInfiniteData(result) as EmailMessageDto[]);
                markReadMutation.mutate({
                    ticketId: ticketId,
                    channel: ChannelTypes.Email
                });

            }
        });

    const fetchMoreEmailMessages = () => {
        if (emailMessageHasNextPage && !isFetchingEmailMessagesNextPage) {
            fetchEmailMessagesNextPage().then();
        }
    }

    const onScroll = ({currentTarget}: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (currentTarget.scrollHeight - currentTarget.scrollTop === currentTarget.clientHeight) {
            fetchMoreEmailMessages();
        }
    }

    useEffect(() => {
        if (ticketId) {
            emailMessagesQueryRefetch().then();
        }
    }, [ticketId, emailMessagesQueryRefetch]);



    if (emailMessagesQueryIsLoading) {
        return <Spinner fullScreen />
    }

    const onEmailReplySuccess = (newMessage: EmailMessageDto) => {
        setMessages([newMessage, ...messages]);
        messageListContainerRef.current?.scrollTo(0, 0);
    }

    return (
        ticket ?
            <div className='w-full flex flex-col'>
                {(!messages || messages.length === 0)  && !isFetching &&<NewEmailHeader/>}
                <div className='pb-4'>
                    <ConversationHeader info={{...ticket, ticketId: ticket.id, createdForEndpoint: ticket.incomingEmailAddress}}
                                        ticket={ticket}
                                        refetchTicket={refetchTicket}
                        forNewTicketMessagePurpose={false} patientPhoto={patientPhoto} conversationChannel={ChannelTypes.Email}
                        patient={patient} contact={contact} />
                </div>
                {messages && messages.length > 0 &&
                    <div className='flex flex-col flex-auto overflow-y-auto'>
                        <div ref={messageListContainerRef} className='overflow-y-auto' onScroll={onScroll}>
                            {
                                messages.length ? messages.map((m: EmailMessageDto, index) =>
                                    <EmailMessage
                                        key={m.id}
                                        index={index}
                                        emailCount={messages.length}
                                        message={m}
                                        ticketCreatedForName={ticket.createdForName || ''}
                                        ticketHeaderPhoto={patientPhoto || ''} />
                                ) : null
                            }
                            {
                                isFetchingEmailMessagesNextPage && <Spinner />
                            }
                        </div>

                        <div className='mt-auto'>
                            {!!emailDisabledText && <div className='unavailable-sms pb-4 px-16'>
                                <Alert message={emailDisabledText} type='error'/>
                            </div>}
                            <EmailReply disabled={!!emailDisabledText || ticket?.isPassive} ticket={ticket} patient={patient} contact={contact} onMailSend={onEmailReplySuccess} />
                        </div>
                    </div>
                }
                {(!messages || messages.length === 0) && !isFetching && <SendFirstEmail onMailSend={() => emailMessagesQueryRefetch()} contact={contact} patient={patient} ticket={ticket} />}
            </div> : null
    )
}

export default EmailConversation;
