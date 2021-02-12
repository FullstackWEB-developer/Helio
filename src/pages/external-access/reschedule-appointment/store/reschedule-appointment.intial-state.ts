import {AppointmentSlot} from "../models/appointment-slot.model";

export interface RescheduleAppointmentState {
    isOpenSlotsLoading: boolean;
    openSlots?: AppointmentSlot[];
    error?: string;
    rescheduledAppointment?: AppointmentSlot | null;
    isAppointmentRescheduling: boolean;
}

const initialescheduleAppointmentState: RescheduleAppointmentState = {
    isOpenSlotsLoading: false,
    openSlots: undefined,
    error: "",
    rescheduledAppointment: null,
    isAppointmentRescheduling : false
}

export default initialescheduleAppointmentState;
