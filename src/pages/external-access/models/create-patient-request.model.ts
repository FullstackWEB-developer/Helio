import {ChartAlertAppendInsuranceData} from "@pages/patients/models/append-insurance-data.model";


export interface CreatePatientRequest {
    patient: CreatePatientModel;
    insuranceNote?: ChartAlertAppendInsuranceData;
    imageUploadTag?: string;
}
export interface CreatePatientModel {
    address: string;
    city: string;
    consentToCall: boolean;
    consentToText: boolean;
    departmentId: number;
    dateOfBirth: string;
    email?: string;
    firstName: string;
    lastName: string;
    mobilePhone: string;
    sex: string;
    zip: string;
    referralSourceId: string;
    contactPreference: string;    
}