export const ContentTypeJoined = "application/vnd.amazonaws.connect.event.participant.joined";
export const ContentTypePlainText = "text/plain";
export const ContentTypeInteractive = "application/vnd.amazonaws.connect.message.interactive";
export const ContentTypeLeft = "application/vnd.amazonaws.connect.event.participant.left";
export const ContentTypeChatEnded = "application/vnd.amazonaws.connect.event.chat.ended";
export const ParticipantAgent = "AGENT";
export const ParticipantCustomer = "CUSTOMER";
export const MessageTypeEvent = "EVENT";
export const MessageTypeMessage = "MESSAGE";
export interface ChatMessage {
    ContentType: string;
    Content?: string;
    Id: string;
    DisplayName?: string;
    Type: string;
    ParticipantRole?: string;
    AbsoluteTime: Date;
    ParticipantId?:string;
}

export interface ChatInteractiveMessage {
    data: ChatInteractiveMessageData,
    templateType: string;
    version: string;
}

export interface ChatInteractiveMessageData {
    content: ChatInteractiveMessageContent
}
export interface ChatInteractiveMessageContent {
    title: string;
    elements: ChatInteractiveMessageElement
}
export interface ChatInteractiveMessageElement {
    title: string;
}

export interface ChatTranscript {
    Transcript: ChatMessage[];
}
