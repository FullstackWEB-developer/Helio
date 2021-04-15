import Api from './api';
import {Dispatch} from '@reduxjs/toolkit';
import Logger from './logger';
import {setError, setSearching} from '@components/search-bar/store/search-bar.slice';
import {
    clearPatients,
    setPatients
} from '@pages/patients/store/patients.slice';

const logger = Logger.getInstance();
const patientsUrl = '/patients';

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


export interface VerifyPatientProps{
    dob:string,
    phone: string,
    zip: string
}

export const verifyPatient = async ({ phone, dob, zip} : VerifyPatientProps) => {
    const url = `${patientsUrl}/verify?dateOfBirth=${dob}&phoneNumber=${phone}&zipCode=${zip}`;
    const response = await Api.get(url);
    return response.data;
}

