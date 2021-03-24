import { Paging } from '../../../shared/models/paging.model';

export interface PatientTicketsRequest extends Paging {
    patientId?: number;
}
