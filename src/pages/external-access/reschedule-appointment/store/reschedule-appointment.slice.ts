import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialescheduleAppointmentState from './reschedule-appointment.intial-state';
import { AppointmentSlot } from '../models/appointment-slot.model';

const rescheduleAppointmentSlice = createSlice({
    name: 'rescheduleAppointmentSlice',
    initialState: initialescheduleAppointmentState,
    reducers: {
        startOpenSlotsRequest(state) {
            state.openSlots = []
            state.isOpenSlotsLoading = true;
            state.error = '';
        },
        endOpenSlotsRequest(state, { payload }: PayloadAction<string>) {
            state.isOpenSlotsLoading = false;
            state.error = payload;
        },
        clearRescheduleAppointmentState(state) {
            state.isOpenSlotsLoading = false;
            state.error = '';
            state.openSlots = [];
            state.isAppointmentRescheduling = false;
            state.rescheduledAppointment = null;
        },
        setOpenSlots(state, { payload }: PayloadAction<AppointmentSlot[]>) {
            state.openSlots = payload;
            state.isOpenSlotsLoading = false;
            state.error = '';
        },
        setRescheduledAppointment(state, { payload }: PayloadAction<AppointmentSlot>) {
            state.rescheduledAppointment = payload;
            state.error = '';
            state.isAppointmentRescheduling = false;
        },

        startRescheduleAppointment(state) {
            state.rescheduledAppointment = null;
            state.error = '';
            state.isAppointmentRescheduling = true;
        },

        selectedAppointmentUpdated(state) {
            state.openSlots = undefined;
        },

        endRescheduleAppointment(state, { payload }: PayloadAction<string>) {
            state.rescheduledAppointment = null;
            state.error = payload;
            state.isAppointmentRescheduling = false;
        }
    }
});

export const {
    startOpenSlotsRequest,
    endOpenSlotsRequest,
    clearRescheduleAppointmentState,
    setRescheduledAppointment,
    startRescheduleAppointment,
    endRescheduleAppointment,
    setOpenSlots,
    selectedAppointmentUpdated
} = rescheduleAppointmentSlice.actions;

export default rescheduleAppointmentSlice.reducer;
