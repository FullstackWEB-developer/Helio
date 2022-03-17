import {Paging} from '@shared/models/paging.model';

export interface TicketQuery extends Paging {
    searchTerm?: string;
    ticketNumber?: number;
    statuses?: number[];
    fromDate?: string;
    toDate?: string;
    priority?: number;
    channels?: number[];
    ticketTypes?: number[];
    departments?: string[];
    reasons?: string[];
    locations?: string[];
    assignedTo?: string[];
    tags?: string[];
    sorts?: string[];
    states?: number[];
    patientRating?: number[];
    botRating?: number[];
}
