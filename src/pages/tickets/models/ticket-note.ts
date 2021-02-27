export interface TicketNote {
    id?: number;
    noteText: string;
    isVisibleToPatient?: boolean;
    dateTime?: Date;
    username?: string;
}
