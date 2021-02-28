import Api from './api';
import { Dispatch } from '@reduxjs/toolkit';
import {
    setPatientChartSummary,
    setPatientChartClinical,
    setPatientChartInsurance,
    setSummaryLoading,
    setClinicalLoading,
    setInsuranceLoading, clearPatientClinical, clearPatientInsurance, clearPatientSummary, setSummaryError, setClinicalError, setInsuranceError
} from '../../pages/patients/store/patients.slice';
import Logger from './logger';

const logger = Logger.getInstance();
const patientsUrl = '/patients';

export const getPatientSummary = (patientId: string) => {
    const url = `${patientsUrl}/${patientId}/summary`;
    return async (dispatch: Dispatch) => {
        dispatch(setSummaryError(false));
        dispatch(setSummaryLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatientChartSummary(response.data));
            })
            .catch(error => {
                logger.error('Failed getting patient summary', error);
                dispatch(setSummaryError(true));
                dispatch(clearPatientSummary());
            })
            .finally(() => dispatch(setSummaryLoading(false)));
    }
}

export const getPatientClinicalDetails = (patientId: string) => {
    const url = `${patientsUrl}/${patientId}/clinical`;
    return async (dispatch: Dispatch) => {
        dispatch(setClinicalError(false));
        dispatch(setClinicalLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatientChartClinical(response.data));
            })
            .catch(error => {
                logger.error('Failed getting patient clinical', error);
                dispatch(setClinicalError(true));
                dispatch(clearPatientClinical());
            })
            .finally(() => dispatch(setClinicalLoading(false)));
    }
}

export const getPatientInsurance = (patientId: string) => {
    const url = `${patientsUrl}/${patientId}/insurance`;
    return async (dispatch: Dispatch) => {
        dispatch(setInsuranceError(false));
        dispatch(setInsuranceLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatientChartInsurance(response.data));
            })
            .catch(error => {
                logger.error('Failed getting patient insurance', error);
                dispatch(setInsuranceError(true));
                dispatch(clearPatientInsurance());
            })
            .finally(() => setInsuranceLoading(false));
    }
}
