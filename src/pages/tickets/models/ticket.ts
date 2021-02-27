import { TicketNote } from './ticket-note';

export interface Ticket {
    id?: string;
    ticketNumber?: number;
    subject?: string;
    detail?: string;
    contactId?: string;
    patientId?: string;
    assignee?: string;
    connectContactId?: string;
    status?: number;
    priority?: number
    channel?: number;
    tags?: [];
    notes?: TicketNote[];
    relations?: [];
    reason?: string;
    dueDate?: Date;
    department?: string;
    location?: string;
    patientChartNumber?: number;
    patientCaseNumber?: number;
    type?: string;
}
