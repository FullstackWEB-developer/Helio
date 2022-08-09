import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import SvgIcon from '@components/svg-icon/svg-icon';
import { Icon } from '@components/svg-icon/icon';
import { toggleCallLogPlayerVisible, toggleChatTranscriptWindowVisible } from '@pages/tickets/store/tickets.slice';
import { useDispatch, useSelector } from 'react-redux';
import { downloadRecordedConversation, getChannel } from '@pages/tickets/utils/ticket-chat-transcript-download-utils';
import { Ticket } from '@pages/tickets/models/ticket';
import { useQuery } from 'react-query';
import { GetRecordedConversationLink } from '@constants/react-query-constants';
import { getFileAsBlob, getRecordedConversationLink } from '@pages/tickets/services/tickets.service';
import { ChannelTypes } from '@shared/models';
import Spinner from '@components/spinner/Spinner';
import i18n from 'i18next';
import utils from '@shared/utils/utils';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ticket}: TicketDetailAttachmentsProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const {email} = useSelector(selectAppUserDetails);

    const hasListenAnyRecordingPermission = useCheckPermission('Tickets.ListenAnyRecording');
    const hasViewAnyTranscriptPermission = useCheckPermission('Tickets.ViewAnyChatTranscript');

    const [downloadUrl, setDownloadUrl] = useState<string>('');
    
    const downloadFileName = async () => {
        const blob = await getFileAsBlob(downloadUrl);
        const tKey = `ticket_detail.info_panel.recorded_conversation.file_name_${getChannel(ticket)}`;
        const fileName = `${i18n.t(tKey)}-${ticket.ticketNumber}.wav`;
        utils.downloadFileFromData(blob, fileName, 'audio/wav');
    }

    const getDownloadElement = () => {
        if (ticket.channel === ChannelTypes.PhoneCall) {
            return (
                <div className='cursor-pointer'>
                    <SvgIcon
                        type={Icon.Download}
                        disabled={!canListenAnyRecording()}
                        onClick={() => downloadFileName()}
                        fillClass='select-arrow-fill'
                    />
                </div>
            )
        }
        return (
            <div className='cursor-pointer'>
                <SvgIcon
                    type={Icon.Download}
                    disabled={!canViewAnyTranscript()}
                    onClick={() => downloadRecordedConversation(ticket)}
                    fillClass={'select-arrow-fill'}
                />
            </div>
        );
    }

    const canListenAnyRecording = () => {
        return !!ticket.connectEvents?.find(a => a.userEmail === email) || ticket.contactAgent === email || hasListenAnyRecordingPermission;
    }

    const canViewAnyTranscript = () => {

        return !!ticket.connectEvents?.find(a => a.userEmail === email) || ticket.contactAgent === email || hasViewAnyTranscriptPermission;
    }

    const canDownloadConversation = () => {
        if (ticket.channel === ChannelTypes.PhoneCall) {
            return canListenAnyRecording();
        } else {
            return canViewAnyTranscript();
        }
    }

    const { isLoading, isFetching } = useQuery([GetRecordedConversationLink, ticket.id], () => getRecordedConversationLink(ticket?.id), {
        enabled: canDownloadConversation(),
        onSuccess: (data) => {
            setDownloadUrl(data);
        }
    });

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
                                        <SvgIcon type={Icon.View} disabled={!canViewAnyTranscript()} onClick={() => dispatch(toggleChatTranscriptWindowVisible())} fillClass='rgba-05-fill' />
                                    }
                                    {ticket.channel === ChannelTypes.PhoneCall &&
                                        <SvgIcon type={Icon.Play} disabled={!canListenAnyRecording()} onClick={() => dispatch(toggleCallLogPlayerVisible())} fillClass='rgba-05-fill' />
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
