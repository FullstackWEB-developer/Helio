import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {MedicalRecordPreviewModel} from '@pages/external-access/models/medical-record-preview.model';
import initialMedicalRecordsState
    from '@pages/external-access/request-medical-records/store/medical-records.initial-state';

const requestMedicalRecordsSlice = createSlice({
    name: 'requestMedicalRecordsSlice',
    initialState: initialMedicalRecordsState,
    reducers: {
        setMedicalRecordsPreviewData(state, {payload}: PayloadAction<MedicalRecordPreviewModel>) {
            state.data = payload;
        }
    }
});

export const {
    setMedicalRecordsPreviewData
} = requestMedicalRecordsSlice.actions

export default requestMedicalRecordsSlice.reducer
