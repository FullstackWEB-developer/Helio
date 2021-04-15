import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import initialAppointmentState from './appointments.initial-state';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';

const appointmentsSlice = createSlice({
    name: 'appointmentsSlice',
    initialState: initialAppointmentState,
    reducers: {
        setSelectedAppointment(state, { payload }: PayloadAction<Appointment>) {
            state.selectedAppointment = payload;
        }
    }
});

export const {
    setSelectedAppointment
} = appointmentsSlice.actions

export default appointmentsSlice.reducer
