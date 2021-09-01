import {getRecordedConversation, getRecordedConversationLink} from '@pages/tickets/services/tickets.service';
import {useQuery} from 'react-query';
import {GetRecordedConversationContent, GetRecordedConversationLink} from '@constants/react-query-constants';
import Spinner from '@components/spinner/Spinner';
import {useTranslation} from 'react-i18next';
import SvgIcon, {Icon} from '@components/svg-icon';
import Avatar from '@components/avatar/avatar';
import './chat-transcript.scss';
import ChatTranscriptMessage from './chat-transcript-message';
import {Ticket} from '@pages/tickets/models/ticket';
import utils from '@shared/utils/utils';
import {Patient} from '@pages/patients/models/patient';
import {useDispatch, useSelector} from 'react-redux';
import {selectUserByEmail} from '@shared/store/lookups/lookups.selectors';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {useEffect, useState} from 'react';
import {getUserList} from '@shared/services/lookups.service';
import {downloadRecordedConversation, getChannel} from '@pages/tickets/utils/ticket-chat-transcript-download-utils';
import {ChatTranscript as ChatTranscriptModel} from '@pages/tickets/models/chat-transcript.model';

export interface ChatTranscriptProps {
    ticket: Ticket;
    patient?: Patient
}

const ChatTranscript = ({ticket, patient}: ChatTranscriptProps) => {
    dayjs.extend(duration);
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const [chatTranscript, setChatTranscript] = useState<ChatTranscriptModel>();

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    const agent = useSelector((state) => selectUserByEmail(state, ticket.contactAgent));

    const {isLoading, isFetching} = useQuery([GetRecordedConversationContent, ticket.id], () => {
        if (!ticket?.id) {
            return undefined;
        }
        return getRecordedConversation(ticket.id)
    }, {
        enabled: true,
        onSuccess: async (data) => {
            setChatTranscript(data);
        }
    });
   

    if (isLoading || isFetching) {
        return <Spinner fullScreen />
    }

    const LabelledInfo = ({
        isFirstColumn = false,
        label,
        value
    }: {isFirstColumn?: boolean, label: string, value?: string}) => {
        return <div className='grid grid-cols-12'>
            <div className={`body2-medium col-span-${isFirstColumn ? '3' : '4'}`}>{t(label)}</div>
            <div className={`${isFirstColumn ? 'subtitle2' : 'body2'} whitespace-pre  col-span-8`}>{` ${value}`}</div>
        </div>
    }

    const GetTimeDiff = (endDate?: string, startDate?: string): string => {
        if (!endDate || !startDate) {
            return '';
        }
        const diff = dayjs(endDate).diff(dayjs(startDate), 'second');
        return dayjs.duration(diff, 'seconds').format('HH:mm:ss');
    }

    return <div className='flex flex-col pt-1 chat-transcript-modal'>
        <div className='flex flex-row items-center justify-between h-10 border-b'>
            <div className=''>
                {t('ticket_detail.chat_transcript.chat_info')}
            </div>

            <div onClick={() => downloadRecordedConversation(ticket, chatTranscript)} className='cursor-pointer'>
                <SvgIcon type={Icon.Download} fillClass={'select-arrow-fill'} />
            </div>
        </div>
        <div className='flex flex-row justify-between pt-2.5'>
            <div className='w-1/2'>
                {patient ? <div className='flex flex-col pb-7'>
                    <div className='body3-medium'>
                        {t('ticket_detail.chat_transcript.patient')}
                    </div>
                    <div className='h7'>
                        {patient ? utils.stringJoin(' ', patient.firstName, patient.lastName) : ''}
                    </div>
                </div> : <>{agent ? <div className='pt-1 pb-16' /> : <span />}</>}
                <LabelledInfo label='ticket_detail.chat_transcript.queue' isFirstColumn={true}
                    value={ticket.queueName ? ticket.queueName : t('common.not_available')} />
                <LabelledInfo label='ticket_detail.chat_transcript.reason' isFirstColumn={true}
                    value={ticket.conversationMainIntent ? ticket.conversationMainIntent : t('common.not_available')} />
            </div>
            <div className='w-1/2'>
                {agent ? <div className='flex flex-row space-x-4 pb-7'>
                    <Avatar userFullName={utils.stringJoin(' ', agent.firstName, agent.lastName)}
                        userPicture={agent.profilePicture} />
                    <div className='flex flex-col'>
                        <div className='body3-medium'>
                            {t('ticket_detail.chat_transcript.agent')}
                        </div>
                        <div>
                            {agent ? utils.stringJoin(' ', agent.firstName, agent.lastName) : ''}
                        </div>
                    </div>
                </div> : <>{patient ? <div className='pt-1 pb-16' /> : <span />}</>}
                <LabelledInfo label='ticket_detail.chat_transcript.date_time'
                    value={ticket.contactInitiationTimestamp ? dayjs(ticket.contactInitiationTimestamp).format('MMM DD, YYYY h:mm A') : t('common.not_available')} />
                <LabelledInfo label='ticket_detail.chat_transcript.wait_time'
                    value={dayjs.duration(ticket.contactWaitDuration ? ticket.contactWaitDuration : 0, 'seconds').format('HH:mm:ss')} />
                <LabelledInfo label='ticket_detail.chat_transcript.duration'
                    value={GetTimeDiff(ticket.contactDisconnectTimestamp, ticket.contactInitiationTimestamp)} />
            </div>
        </div>


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
