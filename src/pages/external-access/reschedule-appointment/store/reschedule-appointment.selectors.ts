import { RootState } from "../../../../app/store";
import { createSelector } from '@reduxjs/toolkit';
import {AppointmentSlot} from "../models/appointment-slot.model";
export const rescheduleAppointmentState = (state: RootState) => state.externalAccessState.rescheduleAppointmentState;

export const selectOpenSlots = createSelector(
    rescheduleAppointmentState,
    state => state.openSlots as AppointmentSlot[]
)

export const selectIsOpenSlotsLoading = createSelector(
    rescheduleAppointmentState,
    state => state.isOpenSlotsLoading as boolean
)

export const selectIsAppointmentRescheduling= createSelector(
    rescheduleAppointmentState,
    state => state.isAppointmentRescheduling as boolean
)

export const selectRescheduledAppointment= createSelector(
    rescheduleAppointmentState,
    state => state.rescheduledAppointment as AppointmentSlot
)

export const selectAppointmentSchedulingError= createSelector(
    rescheduleAppointmentState,
    state => state.error as string
)