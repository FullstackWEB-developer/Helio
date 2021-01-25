import Api from '../../../services/api';
import {Dispatch} from "@reduxjs/toolkit";
import {setSearching, setError} from '../store/search-bar.slice';
import {setPatients, clearPatients, selectPatient, setLoading, clearPatient, setError as setPatientError} from '../../../../pages/patients/store/patients.slice';
import Logger from "../../../services/logger";

const logger = new Logger();
const patientsUrl = '/patients';

export const getPatientById = (patientId: string) => {
    const url = patientsUrl + '/' + patientId;
    return async (dispatch: Dispatch) => {
        dispatch(setPatientError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(selectPatient(response.data))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(clearPatient());
                        break;
                    default:
                        logger.error("Failed searching for patients", error);
                        dispatch(setPatientError(true));
                        dispatch(clearPatient());
                        break;
                }
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }
}

export const searchPatients = (type: number, term: string) => {
    const url = patientsUrl + '?SearchType=' + type + '&SearchTerm=' + term + '&forceSingleReturn=false';
    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setSearching(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatients(response.data))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                    case 409:
                        dispatch(setPatients([]));
                        break;
                    default:
                        logger.error("Failed searching for patients", error);
                        dispatch(setError(true));
                        dispatch(clearPatients());
                        break;
                }
            })
            .finally(() => {
                dispatch(setSearching(false));
            })
    }
}
