import React, {useEffect} from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc'
import {useDispatch, useSelector} from 'react-redux';
import {useParams} from 'react-router';
import withErrorLogging from '@shared/HOC/with-error-logging';
import TicketDetailHeader from './components/ticket-detail/ticket-detail-header';
import TicketInfoPanel from './components/ticket-detail/ticket-detail-info-panel';
import TicketDetailFeed from './components/ticket-detail/ticket-detail-feed';
import TicketDetailAddNote from './components/ticket-detail/ticket-detail-add-note';
import {Ticket} from './models/ticket';
import {useQuery} from 'react-query';
import {getPatientTicketRating, getTicketByNumber} from './services/tickets.service';
import {
    GetContactById,
    GetPatientPhoto,
    GetPatientTicketRating,
    QueryGetPatientById,
    QueryTicketMessagesInfinite,
    QueryTickets
} from '@constants/react-query-constants';
import {
    setPatientPhoto,
    setTicket,
    toggleCallLogPlayerVisible,
    toggleChatTranscriptWindowVisible
} from './store/tickets.slice';
import {selectIsCallLogPlayerVisible, selectIsChatTranscriptModalVisible, selectSelectedTicket} from '@pages/tickets/store/tickets.selectors';
import {getPatientByIdWithQuery, getPatientPhoto} from '@pages/patients/services/patients.service';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {Contact} from '@shared/models/contact.model';
import {getContactById} from '@shared/services/contacts.service';
import Spinner from '@components/spinner/Spinner';
import NoSearchResults from '@components/search-bar/components/no-search-results';
import Modal from '@components/modal/modal';
import ChatTranscript from '@pages/tickets/components/ticket-detail/chat-transcript';
import CallLogAudioPlayer from '@pages/calls-log/components/call-log-player/call-log-player';
import {useTranslation} from 'react-i18next';
import utils from '@shared/utils/utils';
import {ChannelTypes, CommunicationDirection} from '@shared/models';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import {PatientRating} from './models/patient-rating.model';
interface TicketParams {
    ticketNumber: string
}

const TicketDetail = () => {
    dayjs.extend(utc);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {ticketNumber} = useParams<TicketParams>();
    const displayChatTranscript = useSelector(selectIsChatTranscriptModalVisible);
    const isCallLogPlayerVisible = useSelector(selectIsCallLogPlayerVisible);
    const ticket = useSelector(selectSelectedTicket);
    const {isLoading, error, isFetching} = useQuery<Ticket, Error>([QueryTickets, ticketNumber], () =>
        getTicketByNumber(Number(ticketNumber)),
        {
            refetchOnMount: 'always',
            onSuccess: data => {
                dispatch(setTicket(data))
            }
        }
    );

    useEffect(() => {
        return () => {
            dispatch(setPatientPhoto(''));
            dispatch(toggleChatTranscriptWindowVisible(false));
        }
    }, []);

    const {
        data: patient
    } = useQuery<ExtendedPatient, Error>([QueryGetPatientById, ticket?.patientId], () =>
        getPatientByIdWithQuery(ticket.patientId as number),
        {
            enabled: !!ticket?.patientId
        }
    );


    const {
        data: emailMessages,
        isLoading: emailLoading
    } = useQuery([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket?.id], () => getMessages(ticket.id!, ChannelTypes.Email, {
        page: 1,
        pageSize: 50
    }), {
        enabled: !!ticket?.id
    });

    const {
        data: smsMessages,
        isLoading: smsLoading
    } = useQuery([QueryTicketMessagesInfinite, ChannelTypes.SMS, ticket?.id], () => getMessages(ticket.id!, ChannelTypes.SMS, {
        page: 1,
        pageSize: 50
    }), {
        enabled: !!ticket?.id
    });

    useQuery([GetPatientPhoto, ticket?.patientId], () => getPatientPhoto(ticket?.patientId!), {
        enabled: !!ticket?.patientId,
        onSuccess: (data) => {
            dispatch(setPatientPhoto(data));
        }
    });

    const {data: contact} = useQuery<Contact, Error>([GetContactById, ticket?.contactId], () =>
        getContactById(ticket.contactId!),
        {
            enabled: !!ticket?.contactId
        }
    );

    const {data} = useQuery<PatientRating>([GetPatientTicketRating, ticket?.id], () => getPatientTicketRating(ticket.id!), {
        enabled: !!ticket?.id
    });
    useEffect(() => {
        if (data) {
            dispatch(setTicket({...ticket, patientRating: data}))
        }
    }, [ticket?.patientRating]);

    if (isLoading || isFetching) {
        return <Spinner fullScreen />;
    }

    if (error) {
        return <NoSearchResults />;
    }

    if (!ticket) {
        return null;
    }

    const getCallLogAudioPlayerTitle = () => {
        if (!!ticket.createdForName) {
            return ticket.createdForName;
        }
        if (!!ticket.originationNumber) {
            return utils.applyPhoneMask(ticket.originationNumber);
        }
        return t('common.unknown');
    }

    const getCallLogAudioPlayerSubtitle = () => {
        if (!ticket.communicationDirection) {
            return '-';
        }
        return t(`ticket_log.${CommunicationDirection[ticket.communicationDirection].toString().toLowerCase()}`)
    }
    return (
        <>
            <div className='flex w-full'>
                <div className='relative flex flex-col w-3/4'>
                    <TicketDetailHeader ticket={ticket} contact={contact} patient={patient} />
                    <div className='flex items-center justify-center justify-self-center' data-test-id='chat-transcript-modal'>
                        <Modal isOpen={displayChatTranscript}
                            title='ticket_detail.chat_transcript.title'
                            isClosable={true}
                            closeableOnEscapeKeyPress={displayChatTranscript}
                            isDraggable={true}
                            onClose={() => (dispatch(toggleChatTranscriptWindowVisible()))}>
                            <ChatTranscript ticket={ticket} patient={patient} />
                        </Modal>

                        <CallLogAudioPlayer
                            isOpen={isCallLogPlayerVisible}
                            title={getCallLogAudioPlayerTitle()}
                            agentId={ticket.assignee ?? ''}
                            ticketId={ticket.id ?? ''}
                            onClose={() => dispatch(toggleCallLogPlayerVisible())}
                            subTitle={getCallLogAudioPlayerSubtitle()}

                        />
                    </div>
                    <div className='flex-1 mb-auto'>
                        <TicketDetailFeed smsMessages={smsMessages} smsLoading={smsLoading} emailLoading={emailLoading} emailMessages={emailMessages} ticket={ticket} contact={contact} />
                    </div>
                    <div className='absolute bottom-0 w-full'>
                        <TicketDetailAddNote smsMessages={smsMessages} emailMessages={emailMessages} patient={patient} contact={contact} ticket={ticket} />
                    </div>
                </div>
                <div className='w-1/4 overflow-y-auto border-l'>
                    <TicketInfoPanel ticket={ticket} patient={patient} contact={contact} />
                </div>
            </div>
        </>
    );
}

export default withErrorLogging(TicketDetail);
