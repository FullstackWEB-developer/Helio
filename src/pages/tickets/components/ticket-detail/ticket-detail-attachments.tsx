import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import {toggleCallLogPlayerVisible, toggleChatTranscriptWindowVisible} from '@pages/tickets/store/tickets.slice';
import {useDispatch} from 'react-redux';
import {downloadRecordedConversation, getChannel} from '@pages/tickets/utils/ticket-chat-transcript-download-utils';
import {Ticket} from '@pages/tickets/models/ticket';
import {useQuery} from 'react-query';
import {GetRecordedConversationLink} from '@constants/react-query-constants';
import {getRecordedConversationLink} from '@pages/tickets/services/tickets.service';
import {ChannelTypes} from '@shared/models';
import Spinner from '@components/spinner/Spinner';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ticket}: TicketDetailAttachmentsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();

    const [downloadUrl, setDownloadUrl] = useState<string>('');

    const {isLoading, isFetching} = useQuery([GetRecordedConversationLink, ticket.id], () => getRecordedConversationLink(ticket?.id), {
        enabled: true,
        onSuccess: (data) => {
            setDownloadUrl(data);
        }
    });
    const donwloadFileName = () => {
        const extension = ticket.channel === ChannelTypes.PhoneCall ? '.wav' : '.json';
        return `ticket_detail.info_panel.recorded_conversation.file_name_${getChannel(ticket)}-${ticket.ticketNumber}${extension}`;
    }

    const getDownloadElement = () => {
        if (ticket.channel === ChannelTypes.PhoneCall) {
            return (
                <a href={downloadUrl} download={donwloadFileName()}>
                    <SvgIcon type={Icon.Download} fillClass='select-arrow-fill' />
                </a>
            )
        }
        return (
            <div onClick={() => downloadRecordedConversation(ticket)} className='cursor-pointer'>
                <SvgIcon type={Icon.Download} fillClass={'select-arrow-fill'} />
            </div>
        );
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div>
            <dl>
                <div className='flex justify-between row'>
                    <div className='body2-medium'>
                        {t(`ticket_detail.info_panel.recorded_conversation.title_${getChannel(ticket)}`)}
                    </div>
                    {
                        ticket.recordedConversationLink ?
                            <div className='flex flex-row space-x-6'>
                                <div className='cursor-pointer'>
                                    {ticket.channel === ChannelTypes.Chat &&
                                        <SvgIcon type={Icon.View} onClick={() => dispatch(toggleChatTranscriptWindowVisible())} fillClass='rgba-05-fill' />
                                    }
                                    {ticket.channel === ChannelTypes.PhoneCall &&
                                        <SvgIcon type={Icon.Play} onClick={() => dispatch(toggleCallLogPlayerVisible())} fillClass='rgba-05-fill' />
                                    }
                                </div>
                                {(isLoading || isFetching) &&
                                    <Spinner />
                                }
                                {(!isLoading && !isFetching) &&
                                    getDownloadElement()
                                }
                            </div> : t('common.not_available')
                    }
                </div>
            </dl>
        </div>
    </div >
}

export default withErrorLogging(TicketDetailAttachments);
