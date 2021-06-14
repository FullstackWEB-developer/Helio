import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialMedicalRecordsState
    from '@pages/external-access/request-medical-records/store/medical-records.initial-state';
import {DownloadMedicalRecordsProps} from '@pages/patients/services/patients.service';

const requestMedicalRecordsSlice = createSlice({
    name: 'requestMedicalRecordsSlice',
    initialState: initialMedicalRecordsState,
    reducers: {
        setMedicalRecordsPreviewData(state, {payload}: PayloadAction<DownloadMedicalRecordsProps>) {
            state.data = payload;
        }
    }
});

export const {
    setMedicalRecordsPreviewData
} = requestMedicalRecordsSlice.actions

export default requestMedicalRecordsSlice.reducer
