export interface ChartInsurance {
    insuranceId: string;
    InsurancePlanDisplayName: string;
    insurancePackageId: number;
    insurancePackageAddress1: string;
    insurancePackageCity: string;
    insurancePackageState: string;
    insurancePackageZip: string;
    insurancePhone: string;
    insurancePlanName: string;
    sequenceNumber: number;
    eligibilityStatus: string;
    copays: Copay[];
    insurancePlanDisplayName: string;
    insuranceType: string;
}

export interface Copay {
    copayAmount: string,
    copayType: string
}
