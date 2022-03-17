import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';

export interface VerifyPatientState {
    redirectLink?: RedirectLink;
    phoneNumber: string;
    email: string;
    preventRetryUntil: Date | undefined;
    retryPrevented: boolean;
    verifiedLink?: string;
    verificationChannel?: VerificationType
}

const initialVerifyPatientState: VerifyPatientState = {
    redirectLink: undefined,
    phoneNumber: '',
    email: '',
    preventRetryUntil: undefined,
    retryPrevented: false,
}

export default initialVerifyPatientState;
