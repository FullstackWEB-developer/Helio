import {FeedTypes} from '@pages/tickets/models/ticket-feed';
import {ChatActivity, CommunicationDirection, EmailMessageDto, PhoneCallActivity, TicketMessage} from '@shared/models';
import {TicketNote} from '@pages/tickets/models/ticket-note';

export interface FeedDetailDisplayItem {
    belongsToTicket?: string;
    belongsToTicketId?: string;
    isRelatedTicketFeed?: boolean;
    callDuration?: number;
    chatLink?: string;
    communicationDirection?: CommunicationDirection;
    createdBy?: string,
    createdOn?: Date;
    description?: string;
    id?: number;
    ticketMessage?: EmailMessageDto | TicketMessage,
    voiceLink?: string;
    userFullName?: string;
    title?: string;
    userPicture?: string;
    canListenAnyRecording?: boolean;
    canViewAnyTranscript?: boolean;
    feedType?: FeedTypes;
}
