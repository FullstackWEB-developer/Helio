import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';

export interface AppointmentsState {
    selectedAppointment?: Appointment;
    selectedAppointmentSlot?: AppointmentSlot;
    isAppointmentRescheduled: boolean;
    rescheduleTimeFrame: number;
}

const initialAppointmentState: AppointmentsState = {
    selectedAppointment: undefined,
    selectedAppointmentSlot: undefined,
    isAppointmentRescheduled: false,
    rescheduleTimeFrame: 7
}

export default initialAppointmentState;
