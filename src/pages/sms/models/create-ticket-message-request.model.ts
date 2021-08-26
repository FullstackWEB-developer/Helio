import {Ticket} from '@pages/tickets/models/ticket';
import {TicketMessagesDirection} from '@shared/models';

export interface CreateTicketMessageRequest {
    ticket: Ticket,
    direction: TicketMessagesDirection;
    smsMessage : SmsMessage

}

export interface SmsMessage {
    messageBody: string;
}
