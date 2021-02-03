import Api from './api';
import {Dispatch} from "@reduxjs/toolkit";
import Logger from "./logger";
import {setError, setSearching} from '../components/search-bar/store/search-bar.slice';
import {
    clearAppointments,
    clearPatient,
    clearPatients,
    selectPatient,
    setAppointments,
    setError as setPatientError,
    setLoading,
    setPatientIsVerified,
    setPatients
} from '../../pages/patients/store/patients.slice';

const logger = Logger.getInstance();
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

export const verifyPatient = (dateOfBirth: string, phoneNumber: string, zipCode: string) => {
    const url = patientsUrl + '/verify?dateOfBirth=' + dateOfBirth + '&phoneNumber=' + phoneNumber + '&zipCode=' + zipCode;
    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(() => {
                dispatch(setPatientIsVerified(true))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(setPatientIsVerified(false));
                        dispatch(setLoading(false));
                        break;
                    default:
                        logger.error("Failed verifying for patient", error);
                        dispatch(setError(true));
                        dispatch(setPatientIsVerified(false));
                        break;
                }
            });
    }
}

export const getAppointments = (patientId: string) => {
    const url = patientsUrl + '/' + patientId + '/appointments?includePast=true';

    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setAppointments(response.data));
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(setAppointments([]));
                        dispatch(setLoading(false));
                        break;
                    default:
                        logger.error('Failed getting Appointments', error);
                        dispatch(setError(true));
                        dispatch(clearAppointments());
                        dispatch(setLoading(false));
                        break;
                }
            });
    }
}

