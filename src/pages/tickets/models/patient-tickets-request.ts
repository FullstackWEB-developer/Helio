import { Paging } from '@shared/models/paging.model';

export interface PatientTicketsRequest extends Paging {
    patientId?: number;
}

export interface ContactTicketsRequest extends Paging {
    contactId: string;
    sorts?: string[];
}
