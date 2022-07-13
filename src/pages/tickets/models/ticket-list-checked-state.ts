import {CheckboxCheckEvent} from '../../../shared/components/checkbox/checkbox';
import { Ticket } from './ticket';
export interface TicketListCheckedState {
    checkboxCheckEvent: CheckboxCheckEvent;
    ticket: Ticket;
}