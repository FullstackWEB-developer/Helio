export interface AppointmentSlot {
  date: Date;
  appointmentId: number;
  departmentId: number;
  departmentName?: string;
  localProviderId: number;
  appointmentType: string;
  appointmentTypeId: number;
  providerId: number;
  startTime: string;
  duration: number;
  patientAppointmentTypeName: string;
  appointmentStatus: string;
}
