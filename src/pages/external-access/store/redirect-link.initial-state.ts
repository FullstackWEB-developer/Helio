import { Patient } from "../../patients/models/patient";
import { RedirectLink } from '../hipaa-verification/models/redirect-link';

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
