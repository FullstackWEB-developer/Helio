export interface VerifiedPatient {
    firstName: string;
    lastName: string;
    patientId: number;
    primaryProviderId: number;
    departmentId: number;
    defaultProviderId: number;
    defaultDepartmentId: number;
    dateOfBirth: Date;
    token: string;
    tokenExpiration: Date;
}
