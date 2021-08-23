export interface AppointmentSlot {
    date: Date;
    appointmentId: number;
    departmentId: number;
    localProviderId: number;
    appointmentType: string;
    appointmentTypeId: number;
    providerId: number;
    startTime: string;
    duration: number;
    patientAppointmentTypeName: string;
    appointmentStatus: string;
}
