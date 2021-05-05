import { RootState } from '../../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';

export const appointmentsState = (state: RootState) => state.externalAccessState.appointmentsState;

export const selectSelectedAppointment = createSelector(
    appointmentsState,
    items => items.selectedAppointment as Appointment
)

export const selectSelectedAppointmentSlot = createSelector(
    appointmentsState,
    items => items.selectedAppointmentSlot as AppointmentSlot
)
