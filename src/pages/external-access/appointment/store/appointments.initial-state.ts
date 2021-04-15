import {Appointment} from '@pages/external-access/appointment/models/appointment.model';

export interface AppointmentsState {
    selectedAppointment?: Appointment;
}

const initialAppointmentState: AppointmentsState = {
    selectedAppointment: undefined
}

export default initialAppointmentState;
