import {getRecordedConversation} from '@pages/tickets/services/tickets.service';
import {useQuery} from 'react-query';
import {GetChatTranscript} from '@constants/react-query-constants';
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
import {useEffect} from 'react';
import {getUserList} from '@shared/services/lookups.service';
import {downloadRecordedConversation} from '@pages/tickets/utils/ticket-chat-transcript-download-utils';

export interface ChatTranscriptProps {
    ticket: Ticket;
    patient?: Patient
}

const ChatTranscript = ({ticket, patient}: ChatTranscriptProps) => {
    dayjs.extend(duration);
    const {t} = useTranslation();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    const agent = useSelector((state) => selectUserByEmail(state, ticket.contactAgent));
    const {data, isLoading} = useQuery([GetChatTranscript, ticket.id], () => getRecordedConversation(ticket.id!))

    if (isLoading) {
        return <Spinner fullScreen/>
    }

    const LabelledInfo = ({
                              isFirstColumn = false,
                              label,
                              value
                          }: { isFirstColumn?: boolean, label: string, value?: string }) => {
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

    return <div className='chat-transcript-modal flex flex-col pt-1'>
        <div className='flex flex-row justify-between items-center border-b h-10'>
            <div className=''>
                {t('ticket_detail.chat_transcript.chat_info')}
            </div>
            <div className='pr-4 cursor-pointer' onClick={() => downloadRecordedConversation(ticket, data)}>
                <SvgIcon type={Icon.Download} className='icon-medium' fillClass={'rgba-05-fill'}/>
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
                </div> : <>{agent ? <div className='pt-1 pb-16'/> : <span/>}</>}
                <LabelledInfo label='ticket_detail.chat_transcript.queue' isFirstColumn={true}
                              value={ticket.queueName ? ticket.queueName : t('common.not_available')}/>
                <LabelledInfo label='ticket_detail.chat_transcript.reason' isFirstColumn={true}
                              value={ticket.conversationMainIntent ? ticket.conversationMainIntent : t('common.not_available')}/>
            </div>
            <div className='w-1/2'>
                {agent ? <div className='flex flex-row space-x-4 pb-7'>
                    <Avatar userFullName={utils.stringJoin(' ', agent.firstName, agent.lastName)}
                            userPicture={agent.profilePicture}/>
                    <div className='flex flex-col'>
                        <div className='body3-medium'>
                            {t('ticket_detail.chat_transcript.agent')}
                        </div>
                        <div>
                            {agent ? utils.stringJoin(' ', agent.firstName, agent.lastName) : ''}
                        </div>
                    </div>
                </div> : <>{patient ? <div className='pt-1 pb-16'/> : <span/>}</>}
                <LabelledInfo label='ticket_detail.chat_transcript.date_time'
                              value={ticket.contactInitiationTimestamp ? dayjs(ticket.contactInitiationTimestamp).format('MMM DD, YYYY h:mm A') : t('common.not_available')}/>
                <LabelledInfo label='ticket_detail.chat_transcript.wait_time'
                              value={dayjs.duration(ticket.contactWaitDuration ? ticket.contactWaitDuration : 0, 'seconds').format('HH:mm:ss')}/>
                <LabelledInfo label='ticket_detail.chat_transcript.duration'
                              value={GetTimeDiff(ticket.contactDisconnectTimestamp, ticket.contactInitiationTimestamp)}/>
            </div>
        </div>


        <div className='border-b pb-2'>
            {t('ticket_detail.chat_transcript.transcript')}
        </div>
        <div className='pb-2'/>
        <div className='pt-2 h-96 overflow-y-auto'>
            {data?.Transcript.map((message, i) => {
                return <ChatTranscriptMessage message={message} key={message.Id}
                                              previousMessageDisplayName={data?.Transcript[i - 1]?.DisplayName}
                                              previousMessageType={data?.Transcript[i - 1]?.ContentType}/>
            })}
        </div>
        <div className='pb-8'/>
    </div>
}

export default ChatTranscript;
