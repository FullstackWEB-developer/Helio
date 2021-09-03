import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';

export interface VerifyPatientState {
    redirectLink?: RedirectLink;
    phoneNumber: string;
    email: string;
    isVerified: boolean;
    preventRetryUntil: Date | undefined;
    retryPrevented: boolean;
}

const initialVerifyPatientState: VerifyPatientState = {
    redirectLink: undefined,
    phoneNumber: '',
    email: '',
    isVerified: false,
    preventRetryUntil: undefined,
    retryPrevented: false
}

export default initialVerifyPatientState;
