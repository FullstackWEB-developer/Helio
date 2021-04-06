import { AppointmentNote } from '@pages/appointments/models/note.model';

export interface Appointment {
    appointmentId: string,
    appointmentStatus: string,
    appointmentType: string,
    appointmentTypeId: string,
    copay: number
    date: string,
    departmentId: string,
    duration: number
    patientAppointmentTypeName: string,
    providerId: string,
    startTime: string,
    notes?: AppointmentNote[]
}
