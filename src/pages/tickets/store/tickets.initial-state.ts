import {Ticket} from "../models/ticket";

export interface TicketState {
    tickets: Ticket[];
    errors: string;
}

const initialState: TicketState = {
    tickets: [],
    errors: ""
}

export default initialState;
