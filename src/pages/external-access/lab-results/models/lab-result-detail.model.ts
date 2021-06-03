import {LabResultObservation} from "./lab-result-observation.model";

export interface LabResultDetail {
    observationDate: Date;
    observationDateTime: Date;
    observations: LabResultObservation[];
    description: string;
    labResultId: number;
    patientNote: string;
    performingLabName: string;
    createdDateTime: Date;
    encounterDate: Date;
    providerId: number;
    pages: [];
}