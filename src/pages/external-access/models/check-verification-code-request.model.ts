import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';

export interface CheckVerificationCodeRequest {
    patientId: number;
    verificationChannel: VerificationChannel;
    verificationCode: string;
    fingerPrintCode: string;
}
