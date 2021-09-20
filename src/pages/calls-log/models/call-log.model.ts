import {CommunicationDirection, PagedRequest} from "@shared/models";

export interface CallLogModel {
    id: string;
    ticketNumber: string;
    contactId?: string;
    createdForName?: string;
    assigneeUser: string;
    assigneeFullName?: string;
    createdOn?: string;
    agentInteractionDuration?: number;
    contactStatus?: ContactStatus;
    recordedConversationLink?: string;
    ratingScore?: number;
    communicationDirection: CommunicationDirection;
    originationNumber: string;
}

export enum ContactStatus {
    Answered = 1,
    Abandoned = 2,
    Missed = 3,
}

export interface CallLogRequestModel extends PagedRequest {
    searchTerm?: string;
    fromDate?: Date;
    toDate?: Date;
    assignedTo?: string;
    reason?: string;
    contactStatus?: number[];
    communicationDirections?: number[];
    sorts?: string[];
}

