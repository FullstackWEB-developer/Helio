import {TicketType} from "@shared/models";

export enum TicketMessageFilterMatch {
    MessageBody = 1,
    TicketNumber = 2,
    Address = 3,
    Subject = 4
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
    createdForEndpoint: string
    assignedTo?: string;
    filterMatches?: TicketMessageFilterMatch[];
    hasAttachment?: boolean;
}
