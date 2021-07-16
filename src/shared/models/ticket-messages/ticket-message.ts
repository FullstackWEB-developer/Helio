import {TicketMessagesDirection} from "./ticket-messages-direction";
import {ChannelTypes} from "@shared/models/ticket-channel";

export interface TicketMessage extends TicketMessageBase {
    direction: TicketMessagesDirection;
    fromAddress: string;
    isRead: boolean;
    createdName: string;
    createdBy: string;
    createdOn: Date;
}
export interface TicketMessageBase {
    ticketId: string;
    channel: ChannelTypes;
    toAddress?: string;
    recipientName?: string;
    subject?: string;
    body: string;
}