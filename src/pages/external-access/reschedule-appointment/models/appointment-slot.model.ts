export interface AppointmentSlot {
    date: Date;
    appointmentId: number;
    departmentId: number;
    localProviderId: number;
    appointmentType: string;
    providerId: number;
    startTime: string;
    duration: number;
    patientAppointmentTypeName: string;
    appointmentStatus: string;
}