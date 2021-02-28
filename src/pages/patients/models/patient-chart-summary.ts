import { ChartInsurance } from './chart-insurance';
import { PatientOutstandingBalance } from './patient-outstanding-balance';
import { Appointment } from '../../external-access/appointment/models/appointment';
import { PatientCase } from './patient-case';

export interface PatientChartSummary {
    emailAddress: string,
    homePhone: string,
    address: string,
    city: string,
    zip: string,
    state: string,
    isPortalAccessGiven: boolean,
    age?: number,
    consentToText: boolean,
    contactPreference: string,
    primaryInsurance: ChartInsurance,
    outstandingBalance: PatientOutstandingBalance,
    lastAppointment: Appointment,
    upcomingAppointment: Appointment,
    patientCases: PatientCase[]
}
