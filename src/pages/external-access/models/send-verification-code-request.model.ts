import {VerificationType} from '@pages/external-access/models/verification-type.enum';
import {VerificationChannel} from '@pages/external-access/models/verification-channel.enum';

export interface SendVerificationCodeRequest {
    mobilePhoneNumber: string;
    patientId: number;
    verificationChannel: VerificationChannel;
    verificationType: VerificationType;
}
