import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';

export interface VerifyPatientState {
    redirectLink?: RedirectLink;
    phoneNumber: string;
    email: string;
    preventRetryUntil: Date | undefined;
    retryPrevented: boolean;
    verifiedLink?: string;
    verificationChannel?: VerificationType,
    twoFACodeResendDisabled: boolean;
    lastTwoFACodeSentTimestamp: Date | undefined;
}

const initialVerifyPatientState: VerifyPatientState = {
    redirectLink: undefined,
    phoneNumber: '',
    email: '',
    preventRetryUntil: undefined,
    retryPrevented: false,
    twoFACodeResendDisabled: false,
    lastTwoFACodeSentTimestamp: undefined
}

export default initialVerifyPatientState;
