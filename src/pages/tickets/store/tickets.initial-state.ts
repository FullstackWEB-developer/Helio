import { Ticket } from '../models/ticket';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { LookupValue } from '../models/lookup-value';

export interface TicketState {
    error?: string;
    isLookupValuesLoading: boolean;
    isTicketEnumValuesLoading: boolean;
    isRequestAddNoteLoading: boolean;
    tickets: Ticket[];
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
    ticketChannels: [],
    ticketStatuses: [],
    ticketPriorities: [],
    ticketTypes: [],
    enumValues: [],
    lookupValues: []
}

export default initialTicketState;
