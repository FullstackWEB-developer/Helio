import {TicketLogRequestModel} from '@shared/models/ticket-log.model';
export type CallsLogContextType = {
    searchTerm?: string;
    setSearchTerm:(searchTerm: string) => void;
    callsLogFilter: TicketLogRequestModel;
    setCallsLogFilter:(reqModel: TicketLogRequestModel) => void
}
