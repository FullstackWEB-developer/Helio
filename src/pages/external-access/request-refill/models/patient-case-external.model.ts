export enum PatientCaseDocumentSubClass {
    Refill = 1,
    PatientCase
}

export enum PatientCaseDocumentSource {
    Portal = 1,
    Partner
}

export interface PatientCaseExternal {
    departmentId: number;
    providerId: number;
    internalNote: string;
    ignoreNotification: boolean;
    documentSubClass: PatientCaseDocumentSubClass;
    documentSource: PatientCaseDocumentSource;
}

export interface PatientCaseCreateProps {
    patientId: number;
    patientCaseExternal: PatientCaseExternal
}
