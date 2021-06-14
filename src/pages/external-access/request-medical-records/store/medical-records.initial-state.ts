import {DownloadMedicalRecordsProps} from '@pages/patients/services/patients.service';

export interface MedicalRecordsState {
    data?: DownloadMedicalRecordsProps
}

const initialMedicalRecordsState: MedicalRecordsState = {}

export default initialMedicalRecordsState;
