import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import {TicketMessage} from '@shared/models';
export const ticketSmsState = (state: RootState) => state.externalAccessState.ticketSmsState;

export const selectTicketSmsMessages = createSelector(
    ticketSmsState,
    items => items.messages as TicketMessage[]
)


export const selectTicketSmsMarkAsRead = createSelector(
    ticketSmsState,
    items => items.markAsRead as boolean
)
