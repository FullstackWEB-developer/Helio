import { RootState } from '../../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';

export const appointmentsState = (state: RootState) => state.externalAccessState.appointmentsState;

export const selectSelectedAppointment = createSelector(
    appointmentsState,
    items => items.selectedAppointment as Appointment
)
