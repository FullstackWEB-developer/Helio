export interface TicketNote {
    belongsToTicket?: string;
    id?: number;
    noteText: string;
    isVisibleToPatient?: boolean;
    createdOn?: Date;
    createdBy?: string;
    createdByName?: string;
}
