import {Appointment} from "../models/appointment";
import {RedirectLink} from "../models/redirect-link";
import {Patient} from "../../patients/models/patient";

export interface RedirectLinkState {
    appointment?: Appointment;
    patient?: Patient;
    redirectLink?: RedirectLink;
    isLoading: boolean;
    isError: boolean;
}

const initialState: RedirectLinkState = {
    appointment: undefined,
    patient: undefined,
    redirectLink: undefined,
    isError: false,
    isLoading: false
}

export default initialState;
