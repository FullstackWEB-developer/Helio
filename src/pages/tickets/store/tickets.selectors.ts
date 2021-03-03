import { Ticket } from '../models/ticket';
import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import { TicketLookupValue } from '../models/ticket-lookup-values.model';
import { LookupValue } from '../models/lookup-value';
import {Paging} from '../../../shared/models/paging.model';
import {TicketEnum} from '../models/ticket-enum.model';
import {TicketEnumValue} from '../models/ticket-enum-value.model';

export const ticketState = (state: RootState) => state.ticketState;

export const selectTickets = (state: RootState) => state.ticketState.tickets as Ticket[];

export const selectTicketsPaging = (state: RootState) => state.ticketState.paging as Paging;

export const selectTicketById = (state: RootState, id: string): Ticket => {
    return selectTickets(state).find((x: Ticket) => x.id === id) as Ticket;
};

export const selectTicketsLoading = (state: RootState) => state.ticketState.ticketsLoading as boolean;

export const selectEnumValues = (state: RootState, key: string): TicketEnumValue[] => {
    if (!state.ticketState.enumValues) {
        return [];
    }
    const values = state.ticketState.enumValues.find((a: TicketEnum) => a.key === key)?.value;
    return values ? values : [];
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

export const selectIsTicketFilterOpen = createSelector(
    ticketState,
    items => items.isFilterOpen
)
