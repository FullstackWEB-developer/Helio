export interface AppointmentCancelReason {
    appointmentCancelReasonId: number;
    name: string;
    noShow: boolean;
    patientRescheduled: boolean;
    providerUnavailable: boolean;
    slotAvailable: boolean;
}
