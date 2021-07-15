import {ChannelTypes} from "@shared/models/ticket-channel";

export interface TicketBase {
    id: string;
    ticketNumber: number;
    status?: number;
    type?: string;
    priority?: number
    channel: ChannelTypes;
    subject: string;
    dueDate?: Date;
    createdOn?: Date;
    closedOn?: Date;
    isOverdue?: boolean;
    patientId?: number;
    contactId: string;
    reason: string;
    assignee?: string;
    createdForName: string;
}
