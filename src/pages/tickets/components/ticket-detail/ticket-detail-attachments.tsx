import React from 'react';
import {useTranslation} from 'react-i18next';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {Ticket} from '../../models/ticket';
import {getRecordedConversation} from '../../services/tickets.service';
import {ChannelTypes} from '../../models/ticket-channel';
import utils from '../../../../shared/utils/utils';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';
import dayjs from 'dayjs';

interface TicketDetailAttachmentsProps {
    ticket: Ticket
}

const TicketDetailAttachments = ({ticket}: TicketDetailAttachmentsProps) => {
    const {t} = useTranslation();

    const getChannel = () => {
        switch (ticket.channel) {
            case ChannelTypes.Chat:
                return 'chat';
            case ChannelTypes.PhoneCall:
                return 'voice';
            default:
                return 'chat';
        }
    };

    const downloadRecordedConversation = async () => {
        if (ticket?.id) {
            const data = await getRecordedConversation(ticket.id);
            if (data && data?.Transcript?.length) {
                let humanReadableContent = '';
                for(let i = 0; i < data.Transcript.length; i++)
                {
                    let nextTranscript = null;
                    if(i < data.Transcript.length -1){
                        nextTranscript = data.Transcript[i+1];
                    }
                    const result = printTranscriptMessage(data.Transcript[i], nextTranscript);
                    humanReadableContent += result.output;
                    if(result.shouldIgnoreNextMessage){
                        i += 1;
                    }
                }               
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(
                    new Blob([humanReadableContent], { type: 'text/plain' })
                );
                const tKey = `ticket_detail.info_panel.recorded_conversation.file_name_${getChannel()}`;
                link.download = `${t(tKey)} - ${ticket.ticketNumber}.txt`;
                link.click();
            }
           
        }
    }

    const printTranscriptMessage = (transcript: any, nextTranscript: any) => {
        let output = '';
        const newLine = "\r\n";
        const twoEmptyLines = "\r\n\r\n";
    
        let shouldIgnoreNextMessage = false;
        if (transcript.Type === "MESSAGE" && transcript.ContentType === "text/plain") {
            output += `(${utils.formatUtcDate(transcript.AbsoluteTime, 'MMM D, YYYY h:mm A')}) ${transcript.DisplayName}:`;
            output += newLine;
            output += `- ${transcript.Content}`;
    
            if (nextTranscript && nextTranscript.Type === "MESSAGE" && nextTranscript.ContentType === "text/plain"
                && isNextMessageSamePersonAndTime(transcript.DisplayName, transcript.AbsoluteTime, nextTranscript))
                {
                    output += newLine;
                    output += `- ${nextTranscript.Content}`;
                    shouldIgnoreNextMessage = true;
                }
    
                output += twoEmptyLines;
        }
        else if (transcript?.Type === "EVENT" && !transcript?.ContentType?.includes("connect.event.chat.ended")) {
            let eventAction = '';
            output += `(${utils.formatUtcDate(transcript.AbsoluteTime, 'MMM D, YYYY h:mm A')}) ${transcript.DisplayName}`;
    
            if (transcript.ContentType?.includes("participant.joined")) {
                eventAction = t('chat_transcripts.joined_chat');
            }
            else if (transcript.ContentType?.includes("participant.left")) {
                eventAction = t('chat_transcripts.left_chat');
            }
            output += eventAction;
            output += twoEmptyLines;
    
        }
        else {
            output += newLine;
            output += t('chat_transcripts.end_chat');
        }
    
        return {
            output,
            shouldIgnoreNextMessage
        };
    }

    const isNextMessageSamePersonAndTime = (displayName: string, time: string, nextTranscript: any) => {
        return displayName === nextTranscript.DisplayName && utils.formatUtcDate(dayjs(time).toDate(), 'MMM D, YYYY h:mm A') === utils.formatUtcDate(nextTranscript.AbsoluteTime, 'MMM D, YYYY h:mm A');
    }

    return <div className={'py-4 mx-auto flex flex-col'}>
        <div>
            <dl>
                <div className='flex flex row justify-between'>
                    <div className='body2-medium'>
                        {t(`ticket_detail.info_panel.recorded_conversation.title_${getChannel()}`)}
                    </div>
                    {
                        ticket.recordedConversationLink ?
                            <div className='flex flex-row space-x-6'>
                                <div>
                                    {
                                        <SvgIcon type={Icon.Play} fillClass={'channel-icon-fill'}/>
                                    }
                                </div>
                                <div onClick={() => downloadRecordedConversation()} className='cursor-pointer'>
                                    {
                                        <SvgIcon type={Icon.Download} fillClass={'select-arrow-fill'}/>
                                    }
                                </div>
                            </div> : t('common.not_available')
                    }
                </div>
            </dl>
        </div>
    </div>
}

export default withErrorLogging(TicketDetailAttachments);
