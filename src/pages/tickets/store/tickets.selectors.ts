import { Ticket } from '../models/ticket';
import {RootState} from "../../../app/store";

export const selectTickets = (state: RootState) => state.ticketState.tickets

export const selectTicketById = (state: RootState, id: number): Ticket => {
    return selectTickets(state).find(x => x.id === id) as Ticket;
}