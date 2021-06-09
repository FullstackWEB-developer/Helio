import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import initialAppointmentState from './appointments.initial-state';
import {Appointment, AppointmentSlot, AppointmentType} from '@pages/external-access/appointment/models';

const appointmentsSlice = createSlice({
    name: 'appointmentsSlice',
    initialState: initialAppointmentState,
    reducers: {
        setIsAppointmentRescheduled(state, { payload }: PayloadAction<boolean>) {
            state.isAppointmentRescheduled = payload;
        },
        setRescheduleTimeFrame(state, { payload }: PayloadAction<number>) {
            state.rescheduleTimeFrame = payload;
        },
        setSelectedAppointment(state, { payload }: PayloadAction<Appointment>) {
            state.selectedAppointment = payload;
        },
        setSelectedAppointmentSlot(state, { payload }: PayloadAction<AppointmentSlot>) {
            state.selectedAppointmentSlot = payload;
        },
        setAppointmentTypes(state, {payload}: PayloadAction<AppointmentType[]>) {
            state.appointmentTypes = payload;
        }
    }
});

export const {
    setIsAppointmentRescheduled,
    setRescheduleTimeFrame,
    setSelectedAppointment,
    setSelectedAppointmentSlot,
    setAppointmentTypes
} = appointmentsSlice.actions

export default appointmentsSlice.reducer
