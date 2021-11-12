import utils from '@shared/utils/utils';
import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {Patient} from '@pages/patients/models/patient';
import {useSelector} from 'react-redux';
import {selectUserByEmail} from '@shared/store/lookups/lookups.selectors';
import {Ticket} from '@pages/tickets/models/ticket';
import Spinner from '@components/spinner/Spinner';
import duration from 'dayjs/plugin/duration';
export interface TranscriptReviewHeaderProps {
    patient?: Patient;
    ticket?: Ticket;
}

const TranscriptReviewHeader = ({patient, ticket} : TranscriptReviewHeaderProps) => {
    dayjs.extend(duration);
    const {t} = useTranslation();
    const agent = useSelector((state) => selectUserByEmail(state, ticket?.contactAgent));

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

    if (!ticket) {
        return <Spinner fullScreen={true} />
    }

    return <div className='flex flex-row justify-between pt-2.5'>
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
                          value={ticket.contactInitiationTimestamp ? dayjs.utc(ticket.contactInitiationTimestamp).local().format('MMM DD, YYYY h:mm A') : t('common.not_available')} />
            <LabelledInfo label='ticket_detail.chat_transcript.wait_time'
                          value={dayjs.duration(ticket.contactWaitDuration ? ticket.contactWaitDuration : 0, 'seconds').format('HH:mm:ss')} />
            <LabelledInfo label='ticket_detail.chat_transcript.duration'
                          value={utils.getTimeDiffInFormattedSeconds(ticket.contactDisconnectTimestamp, ticket.contactInitiationTimestamp)} />
        </div>
    </div>
}

export default TranscriptReviewHeader;
