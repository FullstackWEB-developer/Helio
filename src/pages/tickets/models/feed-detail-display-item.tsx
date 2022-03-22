import {FeedTypes} from '@pages/tickets/models/ticket-feed';
import {ChatActivity, EmailMessageDto, PhoneCallActivity, TicketMessage} from '@shared/models';
import {TicketNote} from '@pages/tickets/models/ticket-note';

export interface FeedDetailDisplayItem {
    userFullName?: string;
    userPicture?: string;
    title?: string;
    feedType?: FeedTypes;
    dateTime?: Date;
    feedText?: string;
    item?: EmailMessageDto | TicketMessage | TicketNote | PhoneCallActivity | ChatActivity;
}
