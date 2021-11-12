export interface TicketNote {
    id?: number;
    noteText: string;
    isVisibleToPatient?: boolean;
    createdOn?: Date;
    createdBy?: string;
    createdByName?: string;
}
