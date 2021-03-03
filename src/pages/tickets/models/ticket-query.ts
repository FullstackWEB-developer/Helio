import {Paging} from '../../../shared/models/paging.model';

export interface TicketQuery extends Paging {
    searchTerm?: string;
    ticketNumber?: number;
    statuses?: number[];
    fromDate?: Date;
    priority?: number;
    channels?: number[];
    ticketTypes?: number[];
    departments?: string[];
    locations?: string[];
    assignedTo?: string[];
    tags?: string[];
}
