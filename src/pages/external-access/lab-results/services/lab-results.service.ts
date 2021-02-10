import Api from '../../../../shared/services/api';
import { Dispatch } from '@reduxjs/toolkit';
import Logger from '../../../../shared/services/logger';
import {
    setLabResults,
    startGetLabResultsRequest,
    endGetLabResultsRequest
} from '../store/lab-results.slice';

const logger = Logger.getInstance();

export const getPatientsLabResults = (patientId: number, departmentId: number) => {
    const getLabResultsUrl = `/patients/${patientId.toString()}/chart/labresults?departmentId=${departmentId.toString()}&showportalonly=true`;

    return async (dispatch: Dispatch) => {
        dispatch(startGetLabResultsRequest());
        await Api.get(getLabResultsUrl)
            .then(response => {
                dispatch(setLabResults(response.data));
                dispatch(endGetLabResultsRequest(''));
            })
            .catch(error => {
                logger.error('Failed getting LabResults', error);
                dispatch(endGetLabResultsRequest('lab-results.error'));
            });
    }
}

