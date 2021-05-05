import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';

export interface AppointmentsState {
    selectedAppointment?: Appointment;
    selectedAppointmentSlot?: AppointmentSlot;
}

const initialAppointmentState: AppointmentsState = {
    selectedAppointment: undefined,
    selectedAppointmentSlot: undefined
}

export default initialAppointmentState;
