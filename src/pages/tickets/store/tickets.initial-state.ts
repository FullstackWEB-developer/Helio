import {Ticket} from '../models/ticket';
import {TicketOptionsBase} from '../models/ticket-options-base.model';
import {LookupValue} from '../models/lookup-value';
import {TicketQuery} from '../models/ticket-query';
import {DefaultPagination, Paging} from '../../../shared/models/paging.model';
import {TicketEnum} from '../models/ticket-enum.model';
import {TicketListQueryType} from '../models/ticket-list-type';

export interface TicketState {
  error?: string;
  isLookupValuesLoading: boolean;
  isTicketEnumValuesLoading: boolean;
  isRequestAddNoteLoading: boolean;
  isRequestAddFeedLoading: boolean;
  tickets: Ticket[];
  selectedTicket: Ticket | null;
  paging: Paging;
  searchTerm: string;
  errors: string;
  ticketsLoading: boolean;
  ticketChannels?: TicketOptionsBase[];
  ticketStatuses?: TicketOptionsBase[];
  ticketPriorities?: TicketOptionsBase[];
  ticketTypes?: TicketOptionsBase[];
  enumValues: TicketEnum[];
  lookupValues: LookupValue[];
  isFilterOpen: boolean;
  ticketFilter: TicketQuery;
  ticketListQueryType: TicketListQueryType;
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
    searchTerm: '',
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
    feedLastMessageOn: undefined,
    selectedTicket: null,
    ticketListQueryType: TicketListQueryType.AllTicket
}

export default initialTicketState;
