export interface LabResultObservation {
    observationIdentifier: string;
    analyteId: number;
    analyteName: string;
    loinc: string;
    value: string;
    units: string;
    abnormalFlag: string;
    referenceRange: string;
    resultStatus: string;
    note: string;
}