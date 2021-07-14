import {TicketFeed} from './ticket-feed';
import {TicketNote} from './ticket-note';
import {TicketStatuses} from './ticket.status.enum';

export interface Ticket {
    id?: string;
    ticketNumber?: number;
    subject?: string;
    detail?: string;
    reason?: string;
    assignedOn?: Date;
    closedOn?: Date;
    createdOn?: Date;
    modifiedOn?: Date;
    contactId?: string;
    patientId?: number;
    assignee?: string;
    connectContactId?: string;
    status?: TicketStatuses;
    priority?: number
    channel?: number;
    tags?: string[];
    notes?: TicketNote[];
    relations?: [];
    dueDate?: Date;
    department?: string;
    location?: string;
    patientChartNumber?: number;
    patientCaseNumber?: number;
    type?: string;
    feeds?: TicketFeed[];
    recordedConversationLink?: string;
    isDeleted?: boolean;
    ratingScore?: number;
    originationNumber?: string;
    isOverdue?: boolean;
    callbackPhoneNumber?: string;
}
