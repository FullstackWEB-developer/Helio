import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialAppointmentsState from './appointments.initial-state';
import { HotSpotInfo } from '../models/hotspot.model';

const appointmentsSlice = createSlice({
    name: 'appointments',
    initialState: initialAppointmentsState,
    reducers: {
        setHotspotsLoading(state, { payload }: PayloadAction<boolean>) {
            state.isHotspotsLoading = payload;
        },

        setIsHotspotsError(state, { payload }: PayloadAction<boolean>) {
            state.isHotspotsError = payload;
            state.isHotspotsLoading = false;
            if (payload) {
                state.hotspots = []
            }
        },

        setHotSpots(state, { payload }: PayloadAction<HotSpotInfo[]>) {
            state.hotspots = payload;
            state.isHotspotsLoading = false;
        },

        clearHotSpotsData(state) {
            state.hotspots = [];
            state.isHotspotsLoading = false;
            state.isHotspotsError = false;
        }
    }
});

export const { setHotspotsLoading, setIsHotspotsError, setHotSpots, clearHotSpotsData } = appointmentsSlice.actions;

export default appointmentsSlice.reducer;
