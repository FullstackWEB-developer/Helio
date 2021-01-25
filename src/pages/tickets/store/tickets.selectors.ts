import { Ticket } from '../models/ticket';
import { RootState } from '../../../app/store';

export const selectTickets = (state: RootState) => state.ticketState.tickets;

export const selectTicketById = (state: RootState, id: string): Ticket => {
    return selectTickets(state).find((x: Ticket) => x.id === id) as Ticket;
}
