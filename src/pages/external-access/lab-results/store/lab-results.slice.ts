import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialLabResultState from './lab-results.initial-state';
import { LabResult } from '../models/lab-result.model';

const labResultsSlice = createSlice({
    name: 'labResultsSlice',
    initialState: initialLabResultState,
    reducers: {
        setLabResults(state, { payload }: PayloadAction<LabResult[]>) {
            state.labResultList = payload;
            state.isLabResultsLoading = false;
            state.error = '';
        },
        startGetLabResultsRequest(state) {
            state.error = '';
            state.isLabResultsLoading = true;
            state.labResultList = []
        },
        endGetLabResultsRequest(state, { payload }: PayloadAction<string>) {
            state.error = payload;
            state.isLabResultsLoading = false;
        },
        resetLabResultsState(state) {
            state.error = '';
            state.isLabResultsLoading = false;
            state.labResultList = [];
        }
    }
});

export const {
    setLabResults,
    startGetLabResultsRequest,
    endGetLabResultsRequest,
    resetLabResultsState
} = labResultsSlice.actions

export default labResultsSlice.reducer
