import Api from './api';
import utils from '@shared/utils/utils';
import {Patient} from '@pages/patients/models/patient';
const patientsUrl = '/patients';
const contactsUrl = '/contacts';
const ticketsUrl = '/tickets';

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

export const queryContacts = async (searchTerm: string, page = 1) => {
    const {data} = await Api.get(`${contactsUrl}?searchTerm=${searchTerm}&page=${page}`);
    return data;
}

export const queryTickets = async (searchTerm: string, page = 1) => {
    const {data} = await Api.get(`${ticketsUrl}?searchTerm=${searchTerm}&page=${page}`);
    return data;
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

