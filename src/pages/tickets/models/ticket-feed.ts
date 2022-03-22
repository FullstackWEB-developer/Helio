export interface TicketFeed {
    id?: string;
    ticketId?: number;
    createdBy?: string;
    modifiedBy?: string;
    createdOn?: Date;
    modifiedOn?: Date;
    feedType: FeedTypes;
    description?: string;
}

export enum FeedTypes {
    Sms = 1,
    Email,
    StatusChange,
    Note,
    Phone,
    PhoneCall,
    ChatActiviy
}
