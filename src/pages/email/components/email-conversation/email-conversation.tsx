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
import {useInfiniteQuery, useQuery} from 'react-query';
import {useParams} from 'react-router';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import {ChannelTypes, EmailMessageDto} from '@shared/models';
import {DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/sms/constants';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import EmailMessage from '@pages/email/components/email-message/email-message';
import ConversationHeader from '@components/conversation-header/conversation-header';
import SendFirstEmail from '@pages/email/components/send-first-email/send-first-email';
import {getContactById} from '@shared/services/contacts.service';

const EmailConversation = () => {
    const {ticketId} = useParams<{ticketId: string}>();
    const {data: ticket, isFetching} = useQuery([QueryTickets, ticketId], () => getTicketById(ticketId!), {
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
    const {
        refetch: emailMessagesQueryRefetch,
        isFetching: emailMessagesQueryIsFetching,
        isLoading: emailMessagesQueryIsLoading,
        isFetchingNextPage: isFetchingEmaiMessagesNextPage,
        fetchNextPage: fetchEmailMessagesNextPage,
        hasNextPage: emailMessageHasNextPage
    } = useInfiniteQuery([QueryTicketMessagesInfinite],
        ({pageParam = 1}) => getMessages(ticketId || '', ChannelTypes.Email, {...DEFAULT_MESSAGE_QUERY_PARAMS, page: pageParam}),
        {
            enabled: !!ticketId,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                setMessages(utils.accumulateInfiniteData(result) as EmailMessageDto[]);
            }
        });

    const fetchMoreEmailMessages = () => {
        if (emailMessageHasNextPage && !isFetchingEmaiMessagesNextPage) {
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



    if (isFetching || emailMessagesQueryIsLoading) {
        return <Spinner fullScreen />
    }

    return (
        ticket ?
            <div className='w-full flex flex-col'>
                <div className='pb-4'>
                    <ConversationHeader info={{...ticket, ticketId: ticket.id, createdForEndpoint: ticket.incomingEmailAddress}}
                        forNewTicketMessagePurpose={false} patientPhoto={patientPhoto} conversationChannel={ChannelTypes.Email} />
                </div>
                {messages && messages.length > 0 && <div ref={messageListContainerRef} className='overflow-y-auto' onScroll={onScroll}>
                    {
                        emailMessagesQueryIsFetching && !isFetchingEmaiMessagesNextPage ? <Spinner /> :
                            messages?.length ? messages.map((m: EmailMessageDto) =>
                                <EmailMessage
                                    key={m.id}
                                    message={m}
                                    ticketCreatedForName={ticket.createdForName || ''}
                                    ticketHeaderPhoto={patientPhoto || ''} />
                            ) : null
                    }
                    {
                        isFetchingEmaiMessagesNextPage && <Spinner />
                    }
                </div>}
                {(!messages || messages.length === 0) && <SendFirstEmail onMailSend={() => emailMessagesQueryRefetch()} contact={contact} patient={patient} ticket={ticket}/>}
            </div> : null

    )
}

export default EmailConversation;
