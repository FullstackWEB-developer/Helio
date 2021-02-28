import { Ticket } from '../models/ticket';
import { RootState } from '../../../app/store';
import { Assignee, Paging } from './tickets.initial-state';
import { createSelector } from '@reduxjs/toolkit';
import { TicketLookupValue } from '../models/ticket-lookup-values.model';
import { TicketOptionsBase } from '../models/ticket-options-base.model';
import { LookupValue } from '../models/lookup-value';

export const ticketState = (state: RootState) => state.ticketState;

export const selectTickets = (state: RootState) => state.ticketState.tickets as Ticket[];

export const selectTicketsPaging = (state: RootState) => state.ticketState.paging as Paging;

export const selectTicketById = (state: RootState, id: string): Ticket => {
    return selectTickets(state).find((x: Ticket) => x.id === id) as Ticket;
};

export const selectAssignees = (state: RootState) => state.ticketState.assignees as Assignee[];

export const selectTicketsLoading = (state: RootState) => state.ticketState.ticketsLoading as boolean;

export const selectEnumValues = (state: RootState, key: string): TicketOptionsBase[] => {
    if (!state.ticketState.enumValues) {
        return [] as TicketOptionsBase[];
    }
    const values = state.ticketState.enumValues.find((a: TicketOptionsBase) => a.key === key)?.value;
    return values ? values : [] as TicketOptionsBase[];
}

export const selectLookupValues = (state: RootState, key: string): TicketLookupValue[] => {
    if (!state.ticketState.lookupValues) {
        return [] as TicketLookupValue[];
    }
    const values = state.ticketState.lookupValues.find((a: LookupValue) => a.key === key)?.value;
    return values ? values : [] as TicketLookupValue[];
}

export const selectIsTicketEnumValuesLoading = createSelector(
    ticketState,
    items => items.isTicketEnumValuesLoading as boolean
)

export const selectIsTicketLookupValuesLoading = createSelector(
    ticketState,
    items => items.isLookupValuesLoading as boolean
)

export const selectTicketOptionsError = createSelector(
    ticketState,
    items => items.error as string
)
