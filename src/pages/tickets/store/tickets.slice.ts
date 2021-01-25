import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from "./tickets.initial-state";
import {Ticket} from "../models/ticket";

const ticketsSlice = createSlice({
    name: 'tickets',
    initialState,
    reducers: {
        add(state, {payload}: PayloadAction<Ticket[]>) {
            state.tickets = payload;
        },
        changeStatus(state, {payload}: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(ticket => ticket.id === payload.id);
            if(ticket) ticket.status = payload.status;
        },
        changeAssignee(state, {payload}: PayloadAction<Ticket>) {
            const ticket = state.tickets.find(ticket => ticket.id === payload.id);
            if(ticket) ticket.assignee = payload.assignee;
        },
        changeTicket(state, {payload}: PayloadAction<Ticket>) {
            const { id, subject, status } = payload;
            let ticket = state.tickets.find(ticket => ticket.id === id)
            if(ticket){
                ticket.subject = subject
                ticket.status = status
            }
        },
        setFailure: (state, {payload}: PayloadAction<string>) => {
            state.errors = payload;
        }
    }
});

export const { add, changeStatus, changeTicket, changeAssignee, setFailure } = ticketsSlice.actions

export default ticketsSlice.reducer
