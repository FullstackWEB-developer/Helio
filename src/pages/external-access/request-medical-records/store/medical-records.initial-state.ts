import {MedicalRecordPreviewModel} from '@pages/external-access/models/medical-record-preview.model';

export interface MedicalRecordsState {
    data?: MedicalRecordPreviewModel
}

const initialMedicalRecordsState: MedicalRecordsState = {}

export default initialMedicalRecordsState;
