import { AppointmentNote } from '@pages/appointments/models/note.model';

export interface Appointment {
    appointmentId: string;
    appointmentStatus: string;
    appointmentType: string;
    appointmentTypeId: number;
    copay: number;
    date: Date;
    departmentId: number,
    duration: number;
    patientAppointmentTypeName: string;
    providerId: number;
    startTime: string;
    startDateTime: Date;
    notes?: AppointmentNote[];
}
