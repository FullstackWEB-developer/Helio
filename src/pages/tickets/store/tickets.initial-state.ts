import { Ticket } from '../models/ticket';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { LookupValue } from '../models/lookup-value';

export interface Paging {
    page: number,
    pageSize: number,
    totalPages: number,
    totalCount: number,
}

export interface Assignee {
    id: string
}

export interface TicketState {
    error?: string;
    isLookupValuesLoading: boolean;
    isTicketEnumValuesLoading: boolean;
    isRequestAddNoteLoading: boolean;
    tickets: Ticket[];
    paging: Paging,
    assignees: Assignee[],
    errors: string;
    ticketsLoading: boolean
    ticketChannels?: TicketOptionsBase[];
    ticketStatuses?: TicketOptionsBase[];
    ticketPriorities?: TicketOptionsBase[];
    ticketTypes?: TicketOptionsBase[];
    enumValues: TicketOptionsBase[];
    lookupValues: LookupValue[];
}

const initialTicketState: TicketState = {
    error: '',
    isLookupValuesLoading: false,
    isTicketEnumValuesLoading: false,
    isRequestAddNoteLoading: false,
    tickets: [],
    paging: {
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalCount: 0,
    },
    assignees: [],
    errors: '',
    ticketsLoading: false,
    ticketChannels: [],
    ticketStatuses: [],
    ticketPriorities: [],
    ticketTypes: [],
    enumValues: [],
    lookupValues: []
}

export default initialTicketState;
