import {
    ChatInteractiveMessage,
    ChatMessage,
    ContentTypeChatEnded,
    ContentTypeInteractive,
    ContentTypeJoined,
    ContentTypeLeft,
    ContentTypePlainText,
    MessageTypeAttachment,
    MessageTypeEvent,
    MessageTypeMessage
} from '@pages/tickets/models/chat-transcript.model';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import classNames from 'classnames';

const ChatTranscriptMessage = ({message, previousMessageDisplayName= '', previousMessageType =''}: {message: ChatMessage, previousMessageDisplayName?: string, previousMessageType?: string}) => {
    const {t} = useTranslation();
    let messageText = message.Content;
    switch (message.ContentType) {
        case ContentTypePlainText:
            messageText = message.Content;
            break;
        case ContentTypeInteractive:
            const parsed : ChatInteractiveMessage = JSON.parse(message.Content!);
            messageText = parsed.data.content.title;
            break;
        case ContentTypeLeft:
            messageText = t('ticket_detail.chat_transcript.left', {name : message.DisplayName})
            break;
        case ContentTypeJoined:
            messageText = t('ticket_detail.chat_transcript.joined', {name : message.DisplayName})
            break;
        case ContentTypeChatEnded:
            messageText = t('ticket_detail.chat_transcript.ended')
            break;
    }

    const showDisplayName = () => {
        if (message.ContentType === ContentTypeChatEnded ||
            message.ContentType === ContentTypeLeft ||
            message.Type !== MessageTypeAttachment ||
            message.ContentType === ContentTypeJoined) {
            return false;
        }

        if (previousMessageType === ContentTypeJoined && message.DisplayName === previousMessageDisplayName) {
            return true;
        }

        return message.DisplayName !== previousMessageDisplayName;
    }

    const messageClass = classNames( {
        'body2-medium' : message.ContentType === ContentTypeChatEnded ||
            message.ContentType === ContentTypeLeft ||
            message.Type === MessageTypeAttachment ||
            message.ContentType === ContentTypeJoined,
        'body2' : message.ContentType === ContentTypePlainText ||
            message.ContentType === ContentTypeInteractive
    });

    const getMessageText = () => {
        if (message.Type === MessageTypeMessage || message.Type === MessageTypeEvent) {
            return messageText;
        } else if (message.Type === MessageTypeAttachment) {
            return t('ticket_detail.chat_transcript.file_uploaded', { 'fileName': message.Attachments[0].AttachmentName});
        }
    }

    return  <div className='grid grid-cols-8 gap-2'>
        <div className='body2-medium'>
            {`(${dayjs.utc(message.AbsoluteTime).format('HH:mm:ss')})`}
        </div>
        <span className='col-span-7 pl-5 pr-1'>
            {showDisplayName() && <span className='subtitle2'>
                {`${message.DisplayName}:`}
            </span>}
            <span className={messageClass}>{getMessageText()}</span>
        </span>
    </div>;
}

export default ChatTranscriptMessage;
