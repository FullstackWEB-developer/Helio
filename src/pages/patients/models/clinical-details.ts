import { Appointment } from '@pages/external-access/appointment/models';
import { PatientCase } from './patient-case';
import {LabResult} from '@pages/external-access/lab-results/models/lab-result.model';
import {Medication} from '@pages/external-access/request-refill/models/medication.model';

export interface ClinicalDetails {
    patientId: number;
    lastAppointment: Appointment;
    upcomingAppointments: Appointment[];
    patientCases: PatientCase[];
    labResults: LabResult[];
    medications: Medication[];
}
