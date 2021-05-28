export interface Medication {
    medicationName: string;
    enteredBy: string;
    unstructuredSig: string;
    prescribed?: Date;
    stopDate?: Date;
    refillsAllowed: number;
    defaultProviderId: number;
}
