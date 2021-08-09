export enum PatientCaseDocumentSubClass {
    Refill = 1,
    ClinicalQuestion
}

export enum PatientCaseDocumentSource {
    Patient = 1
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
