import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from "./tickets.initial-state";
import {Ticket} from "../models/ticket";

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        add(state, {payload}: PayloadAction<Ticket>) {
            state.tickets.push(payload);
        },
        changeState(state, {payload}: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(ticket => ticket.id === payload.id);
            if(ticket) ticket.status = payload.status;
        },
        changeTicket(state, {payload}: PayloadAction<Ticket>) {
            const { id, comment, status } = payload;
            let ticket = state.tickets.find(ticket => ticket.id === id)
            if(ticket){
                ticket.comment = comment
                ticket.status = status
            }
        }
    }
});

export const { add, changeState, changeTicket } = ticketsSlice.actions

export default ticketsSlice.reducer
