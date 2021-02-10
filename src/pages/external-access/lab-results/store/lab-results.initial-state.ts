import { LabResult } from '../models/lab-result.model';

export interface LabResultsState {
    error?: string;
    isLabResultsError: boolean;
    isLabResultsLoading: boolean;
    labResultList?: LabResult[];
}

const initialLabResultState: LabResultsState = {
    error: "",
    isLabResultsError: false,
    isLabResultsLoading: false,
    labResultList: undefined
}

export default initialLabResultState;
