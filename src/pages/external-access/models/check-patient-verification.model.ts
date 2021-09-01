import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';

export interface CheckPatientVerification {
    mobilePhoneNumber: string;
    fingerprintCode: string;
    verificationChannel: VerificationChannel;
}


