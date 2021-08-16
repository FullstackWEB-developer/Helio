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
import {PatientCaseCreateProps} from '@pages/external-access/request-refill/models/patient-case-external.model';

const patientsBaseUrl = '/patients';
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

export const getPatientMedications = async (patientId: number) => {
    const url = `${patientsBaseUrl}/${patientId}/chart/medications`;
    const result = await Api.get(url);
    return result.data;
}

export const getPatientDefaultPharmacy = async (patientId: number) => {
    const url = `${patientsBaseUrl}/${patientId}/pharmacies/default`;
    const result = await Api.get(url);
    return result.data;
}

export const searchPharmacies = async (patientId: number, departmentId: number, name: string) => {
    const url = `${patientsBaseUrl}/${patientId}/pharmacies?departmentId=${departmentId}&name=${name}`;
    const result = await Api.get(url);
    return result.data;
}

export const createPatientCase = async ({patientId, patientCaseExternal}: PatientCaseCreateProps) => {
    let url = `${patientsBaseUrl}/${patientId}/cases`;

    const params = {
        'departmentId': patientCaseExternal.departmentId,
        'providerId':  parseInt(patientCaseExternal.providerId.toString()),
        'internalNote': patientCaseExternal.internalNote,
        'ignoreNotification': patientCaseExternal.ignoreNotification,
        'documentSubClass': patientCaseExternal.documentSubClass,
        'documentSource': patientCaseExternal.documentSource
    };

    const {data} = await Api.post(url, params);
    return data;
}
