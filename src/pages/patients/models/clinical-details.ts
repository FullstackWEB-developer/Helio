import { Appointment } from '../../external-access/appointment/models/appointment';
import { PatientCase } from './patient-case';

export interface ClinicalDetails {
    patientId: number,
    lastAppointment: Appointment
    upcomingAppointments: Appointment[],
    patientCases: PatientCase[]
}
