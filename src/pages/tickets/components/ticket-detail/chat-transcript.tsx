import {getRecordedConversation, getTicketById} from '@pages/tickets/services/tickets.service';
import {useQuery} from 'react-query';
import {GetRecordedConversationContent, QueryGetPatientById} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import SvgIcon, {Icon} from '@components/svg-icon';
import './chat-transcript.scss';
import ChatTranscriptMessage from './chat-transcript-message';
import {Ticket} from '@pages/tickets/models/ticket';
import {Patient} from '@pages/patients/models/patient';
import {useDispatch, useSelector} from 'react-redux';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {useEffect, useState} from 'react';
import {getUserList} from '@shared/services/lookups.service';
import {downloadRecordedConversation} from '@pages/tickets/utils/ticket-chat-transcript-download-utils';
import {ChatTranscript as ChatTranscriptModel} from '@pages/tickets/models/chat-transcript.model';
import {TranscriptReviewHeader} from '@components/ticket-rating';
import { selectShowChatTicketId } from '@pages/tickets/store/tickets.selectors';
import { getPatientByIdWithQuery } from '@pages/patients/services/patients.service';

export interface ChatTranscriptProps {
    ticket: Ticket;
    patient?: Patient
}

const ChatTranscript = ({ticket, patient}: ChatTranscriptProps) => {
    dayjs.extend(duration);
    const {t} = useTranslation();
    const showChatTicketId = useSelector(selectShowChatTicketId);
    const dispatch = useDispatch();
    const [chatTranscript, setChatTranscript] = useState<ChatTranscriptModel>();
    const [relatedTicket, setRelatedTicket] = useState<Ticket | undefined>(undefined);
    const [relatedPatient, setRelatedPatient] = useState<Patient | undefined>(undefined);

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    const fetchTicketById = useQuery(
        ['Query', showChatTicketId],
        () => getTicketById(showChatTicketId!),
        {
          enabled: !!showChatTicketId,
          onSuccess: ticket => {
            setRelatedTicket(ticket)
          },
        },
      );

    const fetchPatientById = useQuery<Patient, Error>([QueryGetPatientById, relatedTicket?.patientId], () =>
        getPatientByIdWithQuery(ticket.patientId as number),
        {
            enabled: !!relatedTicket?.patientId,
            onSuccess: patient => {
                setRelatedPatient(patient)
            },
        }
    );

    const {isLoading, isFetching} = useQuery([GetRecordedConversationContent, ticket.id, showChatTicketId], () => {
        if (!ticket?.id && showChatTicketId === undefined) {
            return undefined;
        }
        return getRecordedConversation(showChatTicketId ? showChatTicketId : ticket.id)
    }, {
        enabled: true,
        onSuccess: async (data) => {
            setChatTranscript(data);
        }
    });
   

    if (isLoading || isFetching) {
        return <div className='chat-transcript-modal h-96'><Spinner fullScreen /></div>
    }

    return <div className='flex flex-col pt-1 chat-transcript-modal'>
        <div className='flex flex-row items-center justify-between h-10 border-b'>
            <div className=''>
                {t('ticket_detail.chat_transcript.chat_info')}
            </div>

            <div onClick={() => downloadRecordedConversation((relatedTicket ? relatedTicket : ticket), chatTranscript)} className='cursor-pointer'>
                <SvgIcon type={Icon.Download} fillClass={'select-arrow-fill'} />
            </div>
        </div>
        <TranscriptReviewHeader ticket={(relatedTicket ? relatedTicket : ticket)} patient={(relatedPatient ? relatedPatient : patient)} />
        <div className='pb-2 border-b'>
            {t('ticket_detail.chat_transcript.transcript')}
        </div>
        <div className='pb-2' />
        <div className='pt-2 overflow-y-auto h-96'>
            {(isLoading || isFetching) &&
                <Spinner />
            }
            {!isLoading && !isFetching &&
                chatTranscript?.Transcript.map((message, i) => {
                    return <ChatTranscriptMessage message={message} key={message.Id}
                        previousMessageDisplayName={chatTranscript?.Transcript[i - 1]?.DisplayName}
                        previousMessageType={chatTranscript?.Transcript[i - 1]?.ContentType} />
                })}
        </div>
        <div className='pb-8' />
    </div>
}

export default ChatTranscript;
