import { TicketOptionsBase } from './ticket-options-base.model';

export interface TicketLookupValue extends TicketOptionsBase {
    label: string;
    parentValue: string;
    isReadOnly: boolean;
}
