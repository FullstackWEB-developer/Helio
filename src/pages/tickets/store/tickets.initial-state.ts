import {Ticket} from "../models/ticket";

export interface TicketState {
    tickets: Ticket[];
    errors: string;
}

const initialState: TicketState = {
    tickets: [
        {
            id: 1,
            comment: 'Comment 1',
            status: 'OPEN'
        },
        {
            id: 2,
            comment: 'Comment 2',
            status: 'ASSIGNED'
        },
        {
            id: 3,
            comment: 'Comment 3',
            status: 'CLOSED'
        }
    ],
    errors: ""
}




export default initialState;