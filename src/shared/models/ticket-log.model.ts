import {CommunicationDirection, PagedRequest} from "@shared/models";

export interface TicketLogModel {
    id: string;
    ticketNumber: number;
    contactId?: string;
    patientId?: string;
    createdForName?: string;
    assigneeUser: string;
    assigneeFullName?: string;
    createdOn?: string;
    agentInteractionDuration?: number;
    contactStatus?: TicketLogContactStatus;
    recordedConversationLink?: string;
    ratingScore?: number;
    communicationDirection: CommunicationDirection;
    originationNumber: string;
    connectedToSystemTimestamp?: string;
    contactDisconnectTimestamp?: string;
    contactInitiationTimestamp?: string;
    contactAgent?: string;
    hasManagerReview: boolean

}

export enum TicketLogContactStatus {
    Answered = 1,
    Abandoned = 2,
    Missed = 3,
    AgentDisconnected = 4,
    ContactDisconnected = 5
}

export interface TicketLogRequestModel extends PagedRequest {
    searchTerm?: string;
    fromDate?: Date;
    toDate?: Date;
    assignedTo?: string;
    reason?: string;
    contactStatus?: number[];
    communicationDirections?: number[];
    sorts?: string[];
}
