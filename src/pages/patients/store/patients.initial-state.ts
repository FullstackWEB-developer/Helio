import { Patient } from '../models/patient';
import { ExtendedPatient } from '../models/extended-patient';
import { Appointment } from '../../external-access/appointment/models/appointment.model';
import { VerifiedPatient } from '../models/verified-patient';
import { PatientChartSummary } from '../models/patient-chart-summary';
import { ClinicalDetails } from '../models/clinical-details';
import { Insurance } from '../models/insurance';

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
}
export default initialState;
