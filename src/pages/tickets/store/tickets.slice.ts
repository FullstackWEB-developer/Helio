import { Assignee, Paging } from './tickets.initial-state';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Ticket } from '../models/ticket';
import initialTicketState from './tickets.initial-state';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { LookupValue } from '../models/lookup-value';

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
        setAssignees(state, { payload }: PayloadAction<Assignee[]>) {
            state.assignees = payload;
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
        setTicketEnum(state, { payload }: PayloadAction<any>) {
            state.error = '';
            state.isTicketEnumValuesLoading = false;
            const enumValue: TicketOptionsBase = {
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
            state.enumValues = []
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
            state.lookupValues = []
        },
        endGetLookupValuesRequest(state, { payload }: PayloadAction<string>) {
            state.error = payload;
            state.isLookupValuesLoading = false;
        }
    }
});

export const {
    add,
    addPaging,
    changeStatus,
    changeTicket,
    changeAssignee,
    setFailure,
    startRequestAddNote,
    endRequestAddNote,
    setAssignees,
    setTicketEnum,
    startGetTicketEnumRequest,
    endGetTicketEnumRequest,
    setLookupValues,
    setTicketsLoading,
    startGeLookupValuesRequest,
    endGetLookupValuesRequest
} = ticketsSlice.actions

export default ticketsSlice.reducer
