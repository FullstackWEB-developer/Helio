import {ChannelTypes, PagedRequest} from "..";

export interface TicketMessageSummaryRequest extends PagedRequest {
    searchTerm?: string;
    channel: ChannelTypes;
    fromDate?: string;
    toDate?: string;
    assignedTo?: string;
    ticketNumber?: number;
}
