import { RedirectLink } from '../models/redirect-link';
import { Patient } from '../../../patients/models/patient';

export interface RedirectLinkState {
    patient?: Patient;
    redirectLink?: RedirectLink;
    isLoading: boolean;
    isError: boolean;
}

const initialState: RedirectLinkState = {
    patient: undefined,
    redirectLink: undefined,
    isError: false,
    isLoading: false
}

export default initialState;
