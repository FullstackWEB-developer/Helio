
import { PatientAppointmentType } from '@shared/models/patient-appointment-type.enum'
export interface AppointmentType {
    id: number;
    instructions: string;
    name: string;
    cancelable: boolean;
    cancelationTimeFrame?: number;
    cancelationFee?: number;
    reschedulable: boolean;
    rescheduleTimeFrame?: number;
    description?: string;
    createdByName: string;
    modifiedByName?: string;
    createdOn: Date;
    modifiedOn?: Date;
    selectableByPatient: boolean,
    selectedProviders: number [],
    patientType: PatientAppointmentType
}
