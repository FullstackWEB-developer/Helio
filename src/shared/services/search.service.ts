import Api from './api';
import {Dispatch} from '@reduxjs/toolkit';
import Logger from './logger';
import {setError} from '@components/search-bar/store/search-bar.slice';
import {clearPatients, setPatients} from '@pages/patients/store/patients.slice';
import utils from '@shared/utils/utils';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import {Patient} from '@pages/patients/models/patient';
const logger = Logger.getInstance();
const patientsUrl = '/patients';

export const searchPatients = (type: number, term: string) => {
    const url = `${patientsUrl}?SearchType=${type}&SearchTerm=${term}&forceSingleReturn=false`;
    return async (dispatch: Dispatch) => {
        dispatch(setGlobalLoading(true));
        dispatch(setError(false));
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
                dispatch(setGlobalLoading(false));
            })
    }
}

export const getPatients = async (type: number, term: string) => {
    const response = await Api.get<Patient[]>(patientsUrl, {
        params: {
            searchType: type,
            searchTerm: term,
            forceSingleReturn: false
        }
    });
    return response.data;
}


export interface VerifyPatientProps {
    dob: Date,
    phone: string,
    zip: string
}

export const verifyPatient = async ({phone, dob, zip}: VerifyPatientProps) => {
    const url = `${patientsUrl}/verify?dateOfBirth=${utils.toShortISOLocalString(dob)}&phoneNumber=${phone}&zipCode=${zip}`;
    const response = await Api.get(url);
    return response.data;
}

