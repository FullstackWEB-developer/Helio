import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';

export interface AppointmentsState {
    selectedAppointment?: Appointment;
    selectedAppointmentSlot?: AppointmentSlot;
    isAppointmentRescheduled: boolean;
    rescheduleTimeFrame: number;
    appointmentTypes: AppointmentType[];
}

const initialAppointmentState: AppointmentsState = {
    selectedAppointment: undefined,
    selectedAppointmentSlot: undefined,
    isAppointmentRescheduled: false,
    rescheduleTimeFrame: 0,
    appointmentTypes: []
}

export default initialAppointmentState;
