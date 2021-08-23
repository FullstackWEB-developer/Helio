import {RootState} from '../../../../app/store';
import {createSelector} from '@reduxjs/toolkit';
import {
    AppointmentSlotRequest,
    AppointmentType,
    AppointmentSlot,
    Appointment
} from '../models';

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

export const selectAppointmentSlotRequest = createSelector(
    appointmentsState,
    item => item.appointmentSlotRequest as AppointmentSlotRequest
)
