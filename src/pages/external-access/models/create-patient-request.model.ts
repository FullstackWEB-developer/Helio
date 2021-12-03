import {ChartAlertAppendInsuranceData} from "@pages/patients/models/append-insurance-data.model";
import {Option} from '@components/option/option';


export interface CreatePatientRequest {
    patient: CreatePatientModel;
    insuranceNote?: ChartAlertAppendInsuranceData;
    imageUploadTag?: string;
    registrationSessionKey?: string;
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
    state: string;
    address2: string;
    patientId: number;
}

export interface CreatePatientInsuranceModel {
    insuranceType: string;
    insuranceName: string;
    policyHolderName: string;
    insuranceMemberId: string;
    policyHolderDob: Date;
    groupNumber: string;
    insuranceRelation: string;
    insuranceOption?: Option

}
