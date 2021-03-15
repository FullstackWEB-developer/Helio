export interface TicketFeed {
    id?: string;
    ticketId: number;
    createdBy?: string;
    modifiedBy?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    feedType: number;
    description?: string;
}
