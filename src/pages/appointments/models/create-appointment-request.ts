export interface CreateAppointmentRequest {
    appointmentId: number;
    appointmentTypeId: number;
    patientId: number;
    departmentId: number;
    ignoreSchedulablePermission?: boolean;
}
