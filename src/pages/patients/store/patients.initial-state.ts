import { Patient } from '../models/patient';
import { ExtendedPatient } from '../models/extended-patient';
import { Appointment } from '@pages/external-access/appointment/models';
import { VerifiedPatient } from '../models/verified-patient';
import { PatientChartSummary } from '../models/patient-chart-summary';
import { ClinicalDetails } from '../models/clinical-details';
import { Insurance } from '../models/insurance';
import {AppointmentType} from '@pages/external-access/appointment/models';

export interface PatientsState {
    appointmentList?: Appointment[];
    patientList?: Patient[];
    patient?: ExtendedPatient;
    isLoading: boolean;
    isSummaryLoading: boolean;
    isClinicalLoading: boolean;
    isInsuranceLoading: boolean;
    isError: boolean;
    verifiedPatient?: VerifiedPatient;
    patientChartSummary?: PatientChartSummary;
    patientChartClinical?: ClinicalDetails;
    patientChartInsurance?: Insurance[];
    appointmentTypes: AppointmentType[];
}

const initialState: PatientsState = {
    appointmentList: undefined,
    patientList: undefined,
    patient: undefined,
    verifiedPatient: undefined,
    isLoading: false,
    isSummaryLoading: false,
    isClinicalLoading: false,
    isInsuranceLoading: false,
    isError: false,
    patientChartSummary: undefined,
    patientChartClinical: undefined,
    patientChartInsurance: undefined,
    appointmentTypes: []
}
export default initialState;
