import { Medication } from '../models/medication.model';

export interface RequestRefillState {
    isMedicationsLoading: boolean;
    isRequestRefillLoading: boolean;
    isRequestRefillRequestCompleted: boolean;
    medication?: Medication;
    medications: Medication[];
    error?: string;
    refillRequestedMedicationNames: string[];
}

const initialRequestRefillState: RequestRefillState = {
    isMedicationsLoading: false,
    medication: undefined,
    medications: [],
    isRequestRefillLoading: false,
    error: '',
    isRequestRefillRequestCompleted: false,
    refillRequestedMedicationNames: []
}

export default initialRequestRefillState;
