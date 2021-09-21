import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';

export interface VerifyPatientState {
    redirectLink?: RedirectLink;
    phoneNumber: string;
    email: string;
    preventRetryUntil: Date | undefined;
    retryPrevented: boolean;
    verifiedLink?: string;
}

const initialVerifyPatientState: VerifyPatientState = {
    redirectLink: undefined,
    phoneNumber: '',
    email: '',
    preventRetryUntil: undefined,
    retryPrevented: false
}

export default initialVerifyPatientState;
