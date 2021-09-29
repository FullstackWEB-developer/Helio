import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {AppointmentSlot} from '@pages/external-access/appointment/models/appointment-slot.model';
import {AppointmentType} from '@pages/external-access/appointment/models/appointment-type.model';
import {AppointmentSlotRequest} from '../models';

export interface AppointmentsState {
    selectedAppointment?: Appointment;
    patientUpcomingAppointment?: Appointment;
    selectedAppointmentSlot?: AppointmentSlot;
    isAppointmentRescheduled: boolean;
    rescheduleTimeFrame: number;
    appointmentTypes: AppointmentType[];
    appointmentSlotRequest?: AppointmentSlotRequest;
}

const initialAppointmentState: AppointmentsState = {
    selectedAppointment: undefined,
    patientUpcomingAppointment: undefined,
    selectedAppointmentSlot: undefined,
    isAppointmentRescheduled: false,
    rescheduleTimeFrame: 0,
    appointmentTypes: [],
    appointmentSlotRequest: undefined
}

export default initialAppointmentState;
