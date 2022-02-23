export enum AppointmentSlotTimeOfDay {
    EarlyMorning = 1,
    Morning = 2,
    Afternoon = 3
}
export interface AppointmentSlotRequest {
    departmentId?: number;
    startDate: Date;
    endDate: Date;
    providerId?: number[];
    ignoreSchedulablePermission?: boolean;
    appointmentTypeId: number;
    itemCount?: number;
    patientId?: number;
    allowMultipleDepartment?: boolean;
    patientDefaultDepartmentId?: number;
    patientDefaultProviderId?: number
    timeOfDays?: AppointmentSlotTimeOfDay[];
    firstAvailable: boolean;
}

