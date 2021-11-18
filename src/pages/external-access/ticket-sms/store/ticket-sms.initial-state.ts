import {TicketMessage} from '@shared/models';

export interface TicketSmsState {
    messages: TicketMessage[];
    markAsRead: boolean;
}

const initialTicketSmsState: TicketSmsState = {
    messages: [],
    markAsRead: false
}

export default initialTicketSmsState;
