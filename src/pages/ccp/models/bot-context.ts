import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {Ticket} from '@pages/tickets/models/ticket';

export interface BotContext {
    queue: string;
    reason: string;
    patient?: ExtendedPatient;
    ticket?: Ticket;
    isPregnant: boolean;
    id: string;
}
