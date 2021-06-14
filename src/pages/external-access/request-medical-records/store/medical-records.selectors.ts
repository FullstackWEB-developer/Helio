import {RootState} from '../../../../app/store';
import {DownloadMedicalRecordsProps} from '@pages/patients/services/patients.service';

export const selectRequestMedicalRecordsPreviewData = (state: RootState) => state.externalAccessState.requestMedicalRecordState.data as DownloadMedicalRecordsProps;
