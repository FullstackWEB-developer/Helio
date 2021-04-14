import Api from '../../../shared/services/api';
import {Note} from '@pages/patients/models/note';
import Logger from '../../../shared/services/logger';
import {Dispatch} from '@reduxjs/toolkit';
import {
     clearPatient,
     setError as setPatientError,
     setLoading,
     setPatient,
} from '@pages/patients/store/patients.slice';
import {PatientUpdateModel} from '@pages/patients/models/patient-update-model';

export interface AddNoteProps {
     patientId: number;
     note: Note;
}

const patientsUrl = '/patients';
export const addNote = async ({patientId, note}: AddNoteProps) => {
     const result = await Api.put(`${patientsUrl}/${patientId}/notes`, {
          date: note.date,
          userDisplayName: note.userDisplayName,
          text: note.text
     });
     return result.data;
}

export interface UpdatePatientContactInformationProps {
     patientId: number;
     data: PatientUpdateModel;
}

export const updatePatientContactInformation = async ({patientId, data}: UpdatePatientContactInformationProps) => {
     const result = await Api.put(`${patientsUrl}/${patientId}`, {
          mobilePhone: data.mobilePhone,
          address: data.address,
          address2: data.address2,
          homePhone: data.homePhone,
          city: data.city,
          contactPreference: data.contactPreference,
          state: data.state,
          zip: data.zip,
          consentToText: data.consentToText === 'true',
          portalAccessGiven: data.portalAccessGiven === 'true',
          email: data.email
     });
     return result.data;
}


const logger = Logger.getInstance();

export const getPatientSummary = async (patientId: number) => {
     const url = `${patientsUrl}/${patientId}/summary`;
     const result = await Api.get(url);
     return result.data;
}

export const getPatientClinicalDetails = async (patientId: number) => {
     const url = `${patientsUrl}/${patientId}/clinical`;
     const result = await Api.get(url);
     return result.data;
}

export const getPatientInsurance = async (patientId: number) => {
     const url = `${patientsUrl}/${patientId}/insurance`;
     const result = await Api.get(url);
     return result.data;
}

export const getPatientByIdWithQuery = async (patientId: number) => {
     const url = `${patientsUrl}/${patientId}`;
     const response = await Api.get(url);
     return response.data;
}

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
