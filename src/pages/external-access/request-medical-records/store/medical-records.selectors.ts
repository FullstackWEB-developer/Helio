import {RootState} from '../../../../app/store';
import {MedicalRecordPreviewModel} from '@pages/external-access/models/medical-record-preview.model';

export const selectRequestMedicalRecordsPreviewData = (state: RootState) => state.externalAccessState.requestMedicalRecordState.data as MedicalRecordPreviewModel;
