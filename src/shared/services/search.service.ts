import Api from './api';
import {Dispatch} from '@reduxjs/toolkit';
import Logger from './logger';
import {setError, setSearching} from '@components/search-bar/store/search-bar.slice';
import {
    clearAppointments,
    clearPatient,
    clearPatients,
    setAppointments,
    setError as setPatientError,
    setLoading,
    setPatient,
    setPatients
} from '../../pages/patients/store/patients.slice';

const logger = Logger.getInstance();
const patientsUrl = '/patients';

export const getPatientById = (patientId: string) => {
    const url = `${patientsUrl}/${patientId}`;
    return async (dispatch: Dispatch) => {
        dispatch(setPatientError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatient(response.data))
            })
            .catch(error => {
                if (error.response?.status === 404) {
                    dispatch(clearPatient());
                } else {
                    logger.error('Failed searching for patients', error);
                    dispatch(setPatientError(true));
                    dispatch(clearPatient());
                }
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }
}

export const searchPatients = (type: number, term: string) => {
    const url = `${patientsUrl}?SearchType=${type}&SearchTerm=${term}&forceSingleReturn=false`;
    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setSearching(true));
        await Api.get(url)
            .then(response => {
                dispatch(setPatients(response.data))
            })
            .catch(error => {
                if (error.response?.status === 404 || error.response?.status === 409) {
                    dispatch(setPatients([]));
                } else {
                    logger.error('Failed searching for patients', error);
                    dispatch(setError(true));
                    dispatch(clearPatients());
                }
            })
            .finally(() => {
                dispatch(setSearching(false));
            })
    }
}

export const verifyPatient = async (dateOfBirth: string, phoneNumber: string, zipCode: string) => {
    const url = `${patientsUrl}/verify?dateOfBirth=${dateOfBirth}&phoneNumber=${phoneNumber}&zipCode=${zipCode}`;
    const response = await Api.get(url);
    return response.data;
}

export const getAppointments = (patientId: string) => {
    const url = `${patientsUrl}/${patientId}/appointments`;

    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setAppointments(response.data));
            })
            .catch(error => {
                if (error.response?.status === 404) {
                    dispatch(setAppointments([]));
                    dispatch(setLoading(false));
                } else {
                    logger.error('Failed getting Appointments', error);
                    dispatch(setError(true));
                    dispatch(clearAppointments());
                    dispatch(setLoading(false));
                }
            });
    }
}

