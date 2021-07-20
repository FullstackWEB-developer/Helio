import {Ticket} from '../models/ticket';
import {RootState} from '../../../app/store';
import {createSelector} from '@reduxjs/toolkit';
import {TicketLookupValue} from '../models/ticket-lookup-values.model';
import {LookupValue} from '../models/lookup-value';
import {Paging} from '@shared/models/paging.model';
import {TicketEnum} from '../models/ticket-enum.model';
import {TicketEnumValue} from '../models/ticket-enum-value.model';
import {TicketListQueryType} from '../models/ticket-list-type';
import {Option} from '@components/option/option';
import {TicketUpdateModel} from '@pages/tickets/models/ticket-update.model';
import {TicketQuery} from '@pages/tickets/models/ticket-query';

export const ticketState = (state: RootState) => state.ticketState;

export const selectTickets = (state: RootState) => state.ticketState.tickets as Ticket[];

export const selectTicketsPaging = (state: RootState) => state.ticketState.paging as Paging;
export const selectTicketFilter = (state: RootState) => state.ticketState.ticketFilter as TicketQuery;
export const selectTicketQueryType = (state: RootState): TicketListQueryType =>
    state.ticketState.ticketListQueryType || TicketListQueryType.AllTicket;
export const selectSearchTerm = (state: RootState) => state.ticketState.searchTerm;
export const selectFeedLastMessageOn = (state: RootState) => state.ticketState.feedLastMessageOn;

export const selectSelectedTicket = (state: RootState): Ticket => state.ticketState.selectedTicket;

export const selectTicketsLoading = (state: RootState) => state.ticketState.ticketsLoading as boolean;

export const selectEnumValues = (state: RootState, key: string): TicketEnumValue[] => {
    if (!state.ticketState.enumValues) {
        return [];
    }
    const values = state.ticketState.enumValues.find((a: TicketEnum) => a.key === key)?.value;
    return values ? values : [];
}

export const selectEnumValuesAsOptions = (state: RootState, key: string): Option[] => {
    if (!state.ticketState.enumValues) {
        return [];
    }
    const values = state.ticketState.enumValues.find((a: TicketEnum) => a.key === key)?.value;
    return values ? values.map((item: any) => {
        return {
            value: item.key.toString(),
            label: item.value
        };
    }) : [];
}

export const selectLookupValues = (state: RootState, key: string): TicketLookupValue[] => {
    if (!state.ticketState.lookupValues) {
        return [] as TicketLookupValue[];
    }
    const values = state.ticketState.lookupValues.find((a: LookupValue) => a.key === key)?.value;
    return values ? values : [] as TicketLookupValue[];
}

export const selectLookupValuesAsOptions = (state: RootState, key: string): Option[] => {
    if (!state.ticketState.lookupValues) {
        return [] as TicketLookupValue[];
    }
    const values = state.ticketState.lookupValues.find((a: LookupValue) => a.key === key)?.value;
    return values ? values.map((item: any) => {
        return {
            value: item.value,
            label: item.label
        };
    }) : [] as Option[];
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

export const selectTicketUpdateModel = createSelector(
    ticketState,
    state => state.ticketUpdate as TicketUpdateModel
)

export const selectIsChatTranscriptModalVisible = createSelector(
    ticketState,
    state => state.isChatTranscriptModalVisible as boolean
)


export const selectTicketUpdateHash = createSelector(
    ticketState,
    state => state.ticketUpdateHash
)
