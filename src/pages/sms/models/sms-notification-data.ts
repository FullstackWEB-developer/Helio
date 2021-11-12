import {TicketMessagesDirection} from '@shared/models';

export interface SmsNotificationData {
    ticketId: string;
    channelId: string;
    messageId: string;
    assignedToUserId: string;
    createdOn: Date;
    persist: boolean;
    messageDirection: TicketMessagesDirection;
}
