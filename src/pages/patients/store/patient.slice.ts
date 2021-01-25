import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './patient.initial-state';

const patientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {
        setPatientId: (state, {payload}: PayloadAction<string>) => {
            state.patientId = payload;
        }
    }
});

export const { setPatientId } = patientSlice.actions;

export default patientSlice.reducer;
