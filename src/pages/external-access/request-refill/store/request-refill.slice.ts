import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialRequestRefillState from './request-refill.initial-state';
import { Medication } from '../models/medication.model';

const requestRefillSlice = createSlice({
    name: 'requestRefillSlice',
    initialState: initialRequestRefillState,
    reducers: {
        startGetMedicationRequest(state) {
            state.medications = []
            state.isMedicationsLoading = true;
            state.error = '';
        },
        endGetMedicationRequest(state, { payload }: PayloadAction<string>) {
            state.isMedicationsLoading = false;
            state.error = payload;
        },
        clearRequestRefillState(state) {
            state.isRequestRefillRequestCompleted = false;
            state.isMedicationsLoading = false;
            state.error = '';
            state.medications = [];
            state.isRequestRefillLoading = false;
        },
        setMedication(state, { payload }: PayloadAction<Medication>) {
            state.medication = payload;
        },
        setMedications(state, { payload }: PayloadAction<Medication[]>) {
            state.medications = payload?.filter(a => a.refillsAllowed > 0);
            state.isMedicationsLoading = false;
            state.error = '';
        },
        startRequestRefillRequest(state) {
            state.isRequestRefillLoading = true;
            state.error = '';
        },
        endRequestRefillRequest(state, { payload }: PayloadAction<string>) {
            state.isRequestRefillLoading = false;
            state.isRequestRefillRequestCompleted = true;
            state.error = payload;
        },
        addRefillRequestedMedication(state, {payload}: PayloadAction<string>) {
            if (!state.refillRequestedMedicationNames) {
                state.refillRequestedMedicationNames = [];
            }
            state.refillRequestedMedicationNames.push(payload);
        }
    }
});

export const {
    startGetMedicationRequest,
    endGetMedicationRequest,
    setMedication,
    setMedications,
    startRequestRefillRequest,
    endRequestRefillRequest,
    clearRequestRefillState,
    addRefillRequestedMedication
} = requestRefillSlice.actions;

export default requestRefillSlice.reducer;
