import { Medication } from "../models/medication.model";

export interface RequestRefillState {
    isMedicationsLoading: boolean;
    isRequestRefillLoading: boolean;
    isRequestRefillRequestCompleted: boolean;
    medications: Medication[];
    error?: string;
}

const initialRequestRefillState: RequestRefillState = {
    isMedicationsLoading: false,
    medications: [],
    isRequestRefillLoading: false,
    error: "",
    isRequestRefillRequestCompleted: false,
}

export default initialRequestRefillState;
