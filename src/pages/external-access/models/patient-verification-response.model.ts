import {AuthenticationResponse} from '@pages/external-access/models/authentication-response.model';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';

export interface PatientVerificationResponse {
    isVerified: boolean;
    patientId: number;
    email:string;
    authenticationResponse: AuthenticationResponse;
    verifiedPatient: VerifiedPatient;
}


