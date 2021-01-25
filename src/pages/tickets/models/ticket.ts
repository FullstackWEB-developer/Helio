import {Notes} from "./notes";

export interface Ticket {
    id: string;
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
    notes?: Notes[];
    relations?: [];
}
