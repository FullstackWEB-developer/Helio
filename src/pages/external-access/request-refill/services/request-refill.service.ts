import Api from '../../../../shared/services/api';
import Logger from '../../../../shared/services/logger';
import { Dispatch } from '@reduxjs/toolkit';
import {
    endGetMedicationRequest,
    endRequestRefillRequest,
    setMedications,
    startGetMedicationRequest,
    startRequestRefillRequest
} from '../store/request-refill.slice';

const logger = Logger.getInstance();

export const getPatientsMedications = (patientId: string, departmentId: number) => {
    const getMedicationsUrl = `/patients/${patientId}/chart/medications?departmentId=${departmentId.toString()}`;

    return async (dispatch: Dispatch) => {
        dispatch(startGetMedicationRequest());
        await Api.get(getMedicationsUrl)
            .then(response => {
                dispatch(setMedications(response.data.medications));
                dispatch(endGetMedicationRequest(''));
            })
            .catch(error => {
                logger.error('Failed getting RedirectLink', error);
                dispatch(endGetMedicationRequest('request-refill.error'));
            })
    }
}

export const requestRefill = (patientId: string, departmentId: string, providerId: string, note: string) => {
    const requestRefillUrl = `/patients/${patientId}/request-refill?departmentId=${departmentId}&providerId=${providerId}&internalNote=${note}`;

    return async (dispatch: Dispatch) => {
        dispatch(startRequestRefillRequest());
        await Api.get(requestRefillUrl)
            .then(() => {
                dispatch(endRequestRefillRequest(''));
            })
            .catch(error => {
                logger.error('Failed getting RedirectLink', error);
                dispatch(endRequestRefillRequest('request-refill.error'));
            })
    }
}
