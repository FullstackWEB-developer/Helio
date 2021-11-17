import {TicketMessage} from '@shared/models';

export interface TicketSmsState {
    messages: TicketMessage[];
}

const initialTicketSmsState: TicketSmsState = {
    messages: []
}

export default initialTicketSmsState;
