import { Ticket } from '../models/ticket';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { LookupValue } from '../models/lookup-value';
import {TicketQuery} from '../models/ticket-query';
import {DefaultPagination, Paging} from '../../../shared/models/paging.model';
import {TicketEnum} from '../models/ticket-enum.model';
export interface TicketState {
    error?: string;
    isLookupValuesLoading: boolean;
    isTicketEnumValuesLoading: boolean;
    isRequestAddNoteLoading: boolean;
    isRequestAddFeedLoading: boolean;
    tickets: Ticket[];
    paging: Paging,
    errors: string;
    ticketsLoading: boolean
    ticketChannels?: TicketOptionsBase[];
    ticketStatuses?: TicketOptionsBase[];
    ticketPriorities?: TicketOptionsBase[];
    ticketTypes?: TicketOptionsBase[];
    enumValues: TicketEnum[];
    lookupValues: LookupValue[];
    isFilterOpen: boolean;
    ticketFilter: TicketQuery;
    feedLastMessageOn?: Date;
}

const initialTicketState: TicketState = {
    error: '',
    isLookupValuesLoading: false,
    isTicketEnumValuesLoading: false,
    isRequestAddNoteLoading: false,
    isRequestAddFeedLoading: false,
    tickets: [],
    paging: {
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalCount: 0,
    },
    errors: '',
    ticketsLoading: false,
    ticketChannels: [],
    ticketStatuses: [],
    ticketPriorities: [],
    ticketTypes: [],
    enumValues: [],
    lookupValues: [],
    isFilterOpen: false,
    ticketFilter: {
        ...DefaultPagination
    },
    feedLastMessageOn: undefined
}

export default initialTicketState;
