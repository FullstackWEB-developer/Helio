import {Ticket} from '../models/ticket';
import {TicketOptionsBase} from '../models/ticket-options-base.model';
import {LookupValue} from '../models/lookup-value';
import {TicketQuery} from '../models/ticket-query';
import {DefaultPagination, Paging} from '@shared/models/paging.model';
import {TicketEnum} from '../models/ticket-enum.model';
import {TicketListQueryType} from '../models/ticket-list-type';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';

export interface TicketState {
    error?: string;
    isLookupValuesLoading: boolean;
    isTicketEnumValuesLoading: boolean;
    tickets: Ticket[];
    selectedTicket: Ticket | null;
    paging: Paging;
    searchTerm: string;
    errors: string;
    ticketChannels?: TicketOptionsBase[];
    ticketStatuses?: TicketOptionsBase[];
    ticketPriorities?: TicketOptionsBase[];
    ticketTypes?: TicketOptionsBase[];
    enumValues: TicketEnum[];
    lookupValues: LookupValue[];
    isFilterOpen: boolean;
    ticketFilter: TicketQuery;
    isTicketsFiltered: boolean;
    ticketListQueryType?: TicketListQueryType;
    feedLastMessageOn?: Date;
    ticketUpdate?: TicketUpdateModel;
    isChatTranscriptModalVisible: boolean;
    isCallLogPlayerVisible: boolean;
    ticketUpdateHash?: string;
    patientPhoto?: string;
    unreadTickets: number;
    unreadTeamTickets: number;
    teamCallbackTicketCount: number;
    myCallbackTicketCount: number;
}

const initialTicketState: TicketState = {
    error: '',
    isChatTranscriptModalVisible: false,
    isLookupValuesLoading: false,
    isTicketEnumValuesLoading: false,
    tickets: [],
    paging: {
        page: 1,
        pageSize: 25,
        totalPages: 0,
        totalCount: 0,
    },
    searchTerm: '',
    errors: '',
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
    ticketListQueryType: undefined,
    ticketUpdate: undefined,
    ticketUpdateHash: undefined,
    isCallLogPlayerVisible: false,
    isTicketsFiltered: false,
    unreadTickets: 0,
    unreadTeamTickets: 0,
    myCallbackTicketCount: 0,
    teamCallbackTicketCount: 0
}

export default initialTicketState;
