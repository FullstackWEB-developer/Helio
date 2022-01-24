import Api from "./api";
import utils from "@shared/utils/utils";
import { Patient } from "@pages/patients/models/patient";
import { searchTypePatient } from "@components/search-bar/constants/search-type";
const patientsUrl = "/patients";
const contactsUrl = "/contacts";
const ticketsUrl = "/tickets";

export const getPatients = async (
  type: number,
  term: string,
  includePatientDetails: boolean = false
) => {
  if (type === searchTypePatient.patientName) {
      if (term.includes(' ') && !term.includes(',')) {
        term = term.replace(/(\w+)(,)?(\s)?(\w+)?/, "$4, $1");
    }
  }

  const response = await Api.get<Patient[]>(patientsUrl, {
    params: {
      searchType: type,
      searchTerm: term,
      forceSingleReturn: false,
      includePatientDetails: includePatientDetails,
    },
  });
  return response.data;
};

export const queryContacts = async (searchTerm: string, page = 1) => {
    const {data} = await Api.get(`${contactsUrl}?searchTerm=${searchTerm}&page=${page}`);
    return data;
}

export const queryContactsByPhone = async (phoneNumber: string, page = 1) => {
    const {data} = await Api.get(`${contactsUrl}?anyPhoneNumber=${phoneNumber}&page=${page}`);
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

