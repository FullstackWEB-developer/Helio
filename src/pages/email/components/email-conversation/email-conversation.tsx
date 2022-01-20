import React, {useEffect, useRef, useState} from 'react';
import Spinner from '@components/spinner/Spinner';
import {GetPatientPhoto, QueryTicketMessagesInfinite, QueryTickets} from '@constants/react-query-constants';
import SmsHeader from '@pages/sms/components/sms-header/sms-header';
import {getTicketById} from '@pages/tickets/services/tickets.service';
import {useInfiniteQuery, useQuery} from 'react-query';
import {useParams} from 'react-router';
import {getPatientPhoto} from '@pages/patients/services/patients.service';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import {ChannelTypes, EmailMessageDto} from '@shared/models';
import {DEFAULT_MESSAGE_QUERY_PARAMS} from '@pages/sms/constants';
import {getNextPage} from '@pages/sms/utils';
import utils from '@shared/utils/utils';
import EmailMessage from '@pages/email/components/email-message/email-message';
import {EMPTY_GUID} from '@pages/email/constants';

const EmailConversation = () => {
    const {ticketId} = useParams<{ticketId: string}>();
    const {data: ticket, isFetching} = useQuery([QueryTickets, ticketId], () => getTicketById(ticketId!), {
        enabled: !!ticketId && ticketId !== EMPTY_GUID
    });
    const {data: patientPhoto} = useQuery([GetPatientPhoto, ticket?.patientId], () => getPatientPhoto(ticket?.patientId!), {
        enabled: !!ticket?.patientId && ticketId !== EMPTY_GUID
    });
    const [messages, setMessages] = useState<EmailMessageDto[]>([]);
    const messageListContainerRef = useRef<HTMLDivElement>(null);
    const {
        refetch: emailMessagesQueryRefetch,
        isFetching: emailMessagesQueryIsFetching,
        isFetchingNextPage: isFetchingEmaiMessagesNextPage,
        fetchNextPage: fetchEmailMessagesNextPage,
        hasNextPage: emailMessageHasNextPage
    } = useInfiniteQuery([QueryTicketMessagesInfinite],
        ({pageParam = 1}) => getMessages(ticketId || '', ChannelTypes.Email, {...DEFAULT_MESSAGE_QUERY_PARAMS, page: pageParam}),
        {
            enabled: !!ticketId && ticketId !== EMPTY_GUID,
            getNextPageParam: (lastPage) => getNextPage(lastPage),
            onSuccess: (result) => {
                setMessages(utils.accumulateInfiniteData(result) as EmailMessageDto[]);
            }
        });

    const fetchMoreEmailMessages = () => {
        if (emailMessageHasNextPage && !isFetchingEmaiMessagesNextPage) {
            fetchEmailMessagesNextPage();
        }
    }

    const onScroll = ({currentTarget}: React.UIEvent<HTMLDivElement, UIEvent>) => {
        if (currentTarget.scrollHeight - currentTarget.scrollTop === currentTarget.clientHeight) {
            fetchMoreEmailMessages();
        }
    }

    useEffect(() => {
        if (ticketId && ticketId !== EMPTY_GUID) {
            emailMessagesQueryRefetch();
        }
    }, [ticketId, emailMessagesQueryRefetch]);



    if (isFetching) {
        return <Spinner fullScreen />
    }

    return (
        ticket ?
            <div className='w-full flex flex-col'>
                <div className='pb-4'>
                    <SmsHeader info={ticket} forNewTicketMessagePurpose={false} patientPhoto={patientPhoto} />
                </div>
                <div ref={messageListContainerRef} className='overflow-y-auto' onScroll={onScroll}>
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
                </div>
            </div> : null
    )
}

export default EmailConversation;