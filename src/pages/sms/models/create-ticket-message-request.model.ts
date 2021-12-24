import {ChannelTypes, TicketMessagesDirection} from '@shared/models';

export interface CreateTicketMessageRequest {
    body: string;
    direction: TicketMessagesDirection;
    ticketId: string;
    channel: ChannelTypes
}
