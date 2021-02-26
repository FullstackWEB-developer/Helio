import { Ticket } from '../models/ticket';

export interface TicketState {
    isRequestAddNoteLoading: boolean;
    tickets: Ticket[];
    errors: string;
}

const initialState: TicketState = {
    isRequestAddNoteLoading: false,
    tickets: [],
    errors: ''
}

export default initialState;
