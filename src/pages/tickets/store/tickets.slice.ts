import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '../models/ticket';
import initialTicketState from './tickets.initial-state';
import { LookupValue } from '../models/lookup-value';
import { Paging } from '@shared/models/paging.model';
import { TicketEnum } from '../models/ticket-enum.model';
import { TicketQuery } from '../models/ticket-query';

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState: initialTicketState,
    reducers: {
        add(state, { payload }: PayloadAction<Ticket[]>) {
            state.tickets = payload;
        },
        addPaging(state, { payload }: PayloadAction<Paging>) {
            state.paging = payload;
        },
        changeStatus(state, { payload }: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(t => t.id === payload.id);
            if (ticket) {
                ticket.status = payload.status;
            }
        },
        changeAssignee(state, { payload }: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(t => t.id === payload.id);
            if (ticket) {
                ticket.assignee = payload.assignee;
            }
        },
        changeTicket(state, { payload }: PayloadAction<Ticket>) {
            const { id, subject, status } = payload;
            let ticket = state.tickets.find(t => t.id === id)
            if (ticket) {
                ticket.subject = subject
                ticket.status = status
            }
        },
        setTicket(state, { payload }: PayloadAction<Ticket>) {
            state.selectedTicket = payload;
        },
        setFailure: (state, { payload }: PayloadAction<string>) => {
            state.errors = payload;
            state.ticketsLoading = false;
        },
        setTicketsLoading(state, { payload }: PayloadAction<boolean>) {
            state.ticketsLoading = payload;
        },
        startRequestAddNote(state) {
            state.isRequestAddNoteLoading = true;
            state.error = '';
        },
        endRequestAddNote(state, { payload }: PayloadAction<string>) {
            state.isRequestAddNoteLoading = false;
            state.error = payload;
        },
        startRequestAddFeed(state) {
            state.isRequestAddFeedLoading = true;
            state.error = '';
        },
        endRequestAddFeed(state, { payload }: PayloadAction<string>) {
            state.isRequestAddFeedLoading = false;
            state.error = payload;
        },
        setFeedLastMessageOn(state, { payload }: PayloadAction<Date>) {
            state.feedLastMessageOn = payload;
        },
        setTicketEnum(state, { payload }: PayloadAction<any>) {
            state.error = '';
            state.isTicketEnumValuesLoading = false;
            const enumValue: TicketEnum = {
                key: payload.key,
                value: payload.result
            }
            if (!state.enumValues) {
                state.enumValues = [];
            }
            state.enumValues.push(enumValue);
        },
        startGetTicketEnumRequest(state) {
            state.error = '';
            state.isTicketEnumValuesLoading = true;
        },
        endGetTicketEnumRequest(state, { payload }: PayloadAction<string>) {
            state.error = payload;
            state.isTicketEnumValuesLoading = false;
        },
        setLookupValues(state, { payload }: PayloadAction<any>) {
            state.error = '';
            state.isLookupValuesLoading = false;
            const lookupValue: LookupValue = {
                key: payload.key,
                value: payload.result
            }
            if (!state.lookupValues) {
                state.lookupValues = [];
            }
            state.lookupValues.push(lookupValue);
        },
        startGeLookupValuesRequest(state) {
            state.error = '';
            state.isLookupValuesLoading = true;
        },
        endGetLookupValuesRequest(state, { payload }: PayloadAction<string>) {
            state.error = payload;
            state.isLookupValuesLoading = false;
        },
        toggleTicketListFilter(state) {
            state.isFilterOpen = !state.isFilterOpen;
        },
        setSearchTerm(state, { payload }: PayloadAction<string>) {
            state.searchTerm = payload;
        },
        setTicketFilter(state, { payload }: PayloadAction<TicketQuery>) {
            state.ticketFilter = payload;
        },
        setTicketDelete(state, { payload }: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(t => t.id === payload.id);
            if (ticket) {
                ticket.isDeleted = !payload.isDeleted;
            }
        },
    }
});

export const {
    add,
    addPaging,
    changeStatus,
    changeTicket,
    changeAssignee,
    setTicket,
    setFailure,
    startRequestAddNote,
    endRequestAddNote,
    startRequestAddFeed,
    endRequestAddFeed,
    setFeedLastMessageOn,
    setTicketEnum,
    startGetTicketEnumRequest,
    endGetTicketEnumRequest,
    setLookupValues,
    setTicketsLoading,
    startGeLookupValuesRequest,
    endGetLookupValuesRequest,
    toggleTicketListFilter,
    setSearchTerm,
    setTicketFilter,
    setTicketDelete
} = ticketsSlice.actions

export default ticketsSlice.reducer
