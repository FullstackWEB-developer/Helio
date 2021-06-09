import { RootState } from '../../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';

export const appointmentsState = (state: RootState) => state.externalAccessState.appointmentsState;

export const selectIsAppointmentRescheduled = createSelector(
    appointmentsState,
    state => state.isAppointmentRescheduled as boolean
)

export const selectRescheduleTimeFrame = createSelector(
    appointmentsState,
    state => state.rescheduleTimeFrame as number
)

export const selectSelectedAppointment = createSelector(
    appointmentsState,
    items => items.selectedAppointment as Appointment
)
export const selectAppointmentTypes = createSelector(
    appointmentsState,
    items => items.appointmentTypes as AppointmentType[]
);

export const selectSelectedAppointmentSlot = createSelector(
    appointmentsState,
    items => items.selectedAppointmentSlot as AppointmentSlot
)
