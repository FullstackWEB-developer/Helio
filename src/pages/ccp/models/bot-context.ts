import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {Ticket} from '@pages/tickets/models/ticket';
import {ContextKeyValuePair} from '@pages/ccp/models/context-key-value-pair';

export interface BotContext {
    queue: string;
    reason: string;
    patient?: ExtendedPatient;
    contactId: string;
    ticket?: Ticket;
    isPregnant: boolean;
    currentContactId: string;
    initialContactId: string;
    attributes?: ContextKeyValuePair[];
    isInBound?: boolean;
}
