import {TicketType} from "../ticket-type.model";

export enum TicketMessageFilterMatch {
    MessageBody = 1,
    TicketNumber = 2,
    Phone = 3
}
export interface TicketMessageSummary {
    ticketId: string;
    ticketNumber: number;
    patientId?: number;
    contactId?: string;
    ticketType: TicketType,
    reason: string;
    messageSummary: string;
    unreadCount: number;
    messageCreatedOn: Date;
    messageCreatedByName: string;
    createdForName: string;
    createdForMobileNumber: string
    assignedTo?: string;
    filterMatches?: TicketMessageFilterMatch[];
}
