import {getRecordedConversation} from '@pages/tickets/services/tickets.service';
import {
    ChatInteractiveMessage,
    ChatMessage, ChatTranscript, ContentTypeChatEnded, ContentTypeInteractive, ContentTypeJoined, ContentTypeLeft,
    ContentTypePlainText,
    MessageTypeEvent,
    MessageTypeMessage
} from '@pages/tickets/models/chat-transcript.model';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';
import {Ticket} from '@pages/tickets/models/ticket';
import {ChannelTypes} from '@shared/models';
import i18n from 'i18next';

export const downloadRecordedConversation = async (ticket: Ticket, data?: ChatTranscript) => {
    if (ticket?.id) {
        if (!data) {
            data = await getRecordedConversation(ticket.id);
        }
        if (data && data?.Transcript?.length) {
            let humanReadableContent = '';
            for(let i = 0; i < data.Transcript.length; i++)
            {
                let nextTranscript = undefined;
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
            const tKey = `ticket_detail.info_panel.recorded_conversation.file_name_${getChannel(ticket)}`;
            link.download = `${i18n.t(tKey)} - ${ticket.ticketNumber}.txt`;
            link.click();
        }

    }
}

const GetMessageContent = (message: ChatMessage) => {
    if (message.ContentType === ContentTypePlainText) {
        return message.Content;
    }
    if (message.ContentType === ContentTypeInteractive) {
        const parsed : ChatInteractiveMessage = JSON.parse(message.Content!);
        return parsed.data.content.title;
    }
}

const printTranscriptMessage = (transcript: ChatMessage, nextTranscript?: ChatMessage) => {
    let output = '';
    const newLine = "\r\n";
    const twoEmptyLines = "\r\n\r\n";

    let shouldIgnoreNextMessage = false;
    if (transcript.Type === MessageTypeMessage && (transcript.ContentType === ContentTypePlainText || transcript.ContentType === ContentTypeInteractive)) {

        output += `(${utils.formatUtcDate(transcript.AbsoluteTime, 'MMM D, YYYY h:mm:ss A')}) ${transcript.DisplayName}:`;
        output += newLine;
        output += `- ${GetMessageContent(transcript)}`;

        if (nextTranscript && nextTranscript.Type === MessageTypeMessage && (nextTranscript.ContentType === ContentTypePlainText  || nextTranscript.ContentType === ContentTypeInteractive)
            && isNextMessageSamePersonAndTime(transcript.DisplayName ?? '', transcript.AbsoluteTime, nextTranscript))
        {
            output += newLine;
            output += `- ${GetMessageContent(nextTranscript)}`;
            shouldIgnoreNextMessage = true;
        }

        output += twoEmptyLines;
    }
    else if (transcript?.Type === MessageTypeEvent && transcript?.ContentType !== ContentTypeChatEnded) {
        let eventAction = '';
        output += `(${utils.formatUtcDate(transcript.AbsoluteTime, 'MMM D, YYYY h:mm A')}) ${transcript.DisplayName}`;

        if (transcript.ContentType == ContentTypeJoined) {
            eventAction = i18n.t('chat_transcripts.joined_chat');
        }
        else if (transcript.ContentType === ContentTypeLeft) {
            eventAction = i18n.t('chat_transcripts.left_chat');
        }
        output += eventAction;
        output += twoEmptyLines;

    }
    else {
        output += newLine;
        output += i18n.t('chat_transcripts.end_chat');
    }

    return {
        output,
        shouldIgnoreNextMessage
    };
}

const isNextMessageSamePersonAndTime = (displayName: string, time: Date, nextTranscript: any) => {
    return displayName === nextTranscript.DisplayName && utils.formatUtcDate(dayjs(time).toDate(), 'MMM D, YYYY h:mm A') === utils.formatUtcDate(nextTranscript.AbsoluteTime, 'MMM D, YYYY h:mm A');
}

export const getChannel = (ticket: Ticket) => {
    switch (ticket.channel) {
        case ChannelTypes.Chat:
            return 'chat';
        case ChannelTypes.PhoneCall:
            return 'voice';
        default:
            return 'chat';
    }
};
