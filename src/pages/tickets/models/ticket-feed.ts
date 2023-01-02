import { CommunicationDirection, EmailMessageDto, TicketMessage } from "@shared/models";

export interface TicketFeed {
    id?: string;
    belongsToTicket?: string;
    belongsToTicketId?: string;
    ticketId?: number;
    createdBy?: string;
    modifiedBy?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    feedType: FeedTypes;
    description?: string;
    ticketMessage?: EmailMessageDto | TicketMessage,
    isRelatedTicketFeed?: boolean;
    callDuration?: number;
    chatLink?: string;
    communicationDirection?: CommunicationDirection;
    voiceLink?: string;
}

export enum FeedTypes {
    Sms = 1,
    Email,
    StatusChange,
    Note,
    Phone,
    PhoneCall,
    ChatActiviy
}
