import {CommunicationDirection, TicketType} from '@shared/models';
import {PatientRating} from './patient-rating.model';
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
    createdByName?: string;
    createdOn?: Date;
    botRatingCreatedOn?: Date;
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
    type?: TicketType;
    feeds?: TicketFeed[];
    recordedConversationLink?: string;
    isDeleted?: boolean;
    botRating?: number;
    originationNumber?: string;
    isOverdue?: boolean;
    createdForName?: string;
    callbackPhoneNumber?: string;
    contactAgent?: string;
    queueName?: string;
    conversationMainIntent?: string;
    contactInitiationTimestamp?: string;
    contactDisconnectTimestamp?: string;
    connectedToAgentTimestamp?: string;
    contactWaitDuration?: number;
    communicationDirection?: CommunicationDirection;
    ipAddress?: string;
    incomingEmailAddress?: string;
    isPassive?: boolean;
    patientRating?: PatientRating;
}
