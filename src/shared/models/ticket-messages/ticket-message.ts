import {TicketMessagesDirection} from "@shared/models";
import {ChannelTypes} from "@shared/models/ticket-channel";
import { CommunicationDirection } from "../communication-direction";

export interface EmailMessageDto extends TicketMessage {
    id: string;
    ccAddress: string;
    attachments: EmailAttachmentHeader[];
}
export interface TicketMessage extends TicketMessageBase {
    fromAddress: string;
    isRead: boolean;
    createdName?: string;
    createdBy: string;
    createdByName?: string;
    createdOn: Date;
    createdForName?: string;
}
export interface PhoneCallActivity {
    callDirection?: CommunicationDirection;
    canListenAnyRecording: boolean;
    callDuration?: number;
}
export interface ChatActivity {
    canViewAnyTranscript: boolean;
}
export interface TicketMessageBase {
    ticketId: string;
    channel: ChannelTypes;
    toAddress?: string;
    recipientName?: string;
    subject?: string;
    body: string;
    patientId?: number;
    contactId?: string;
    direction: TicketMessagesDirection;
}

export interface EmailAttachmentHeader {
    fileName: string;
    mimeType: string;
    size?: number;
}
