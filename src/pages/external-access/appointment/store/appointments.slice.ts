import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import initialAppointmentState from './appointments.initial-state';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';

const appointmentsSlice = createSlice({
    name: 'appointmentsSlice',
    initialState: initialAppointmentState,
    reducers: {
        setSelectedAppointment(state, { payload }: PayloadAction<Appointment>) {
            state.selectedAppointment = payload;
        },
        setSelectedAppointmentSlot(state, { payload }: PayloadAction<AppointmentSlot>) {
            state.selectedAppointmentSlot = payload;
        }
    }
});

export const {
    setSelectedAppointment,
    setSelectedAppointmentSlot
} = appointmentsSlice.actions

export default appointmentsSlice.reducer
