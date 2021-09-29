import Api from '../../../shared/services/api';
import {Note} from '@pages/patients/models/note';
import Logger from '../../../shared/services/logger';
import {Dispatch} from '@reduxjs/toolkit';
import {clearPatient, setError as setPatientError, setLoading, setPatient, } from '@pages/patients/store/patients.slice';
import {PatientUpdateModel} from '@pages/patients/models/patient-update-model';
import {AsyncJobInfo} from '@pages/patients/models/async-job-info.model';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {CheckPatientVerification} from '@pages/external-access/models/check-patient-verification.model';
import {PatientVerificationResponse} from '@pages/external-access/models/patient-verification-response.model';
import {PatientExistsRequest} from '@pages/external-access/models/patient-exists-request.model';
import {PatientExistsResponse} from '@pages/external-access/models/patient-exists-response.model';
import {SendVerificationCodeRequest} from '@pages/external-access/models/send-verification-code-request.model';
import {CheckVerificationCodeRequest} from '@pages/external-access/models/check-verification-code-request.model';
import {GetPatientInfoRequest} from '../../../shared/models/get-patient-info-request.model';
import {Appointment} from '@pages/external-access/appointment/models';
import {CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
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

export const getPatientByIdWithQuery = async (patientId: number, queryParams?: GetPatientInfoRequest): Promise<ExtendedPatient> => {
     const url = `${patientsUrl}/${patientId}`;
     const response = await Api.get(url, {params: queryParams});
     return response.data;
}

export interface DownloadMedicalRecordsProps {
     patientId: number;
     departmentId: number;
     downloadLink: string;
     emailAddress?: string;
     isDownload: boolean;
     startDate?: Date;
     endDate?: Date;
     asHtml: boolean;
     note?: string;
}

export const prepareAndDownloadMedicalRecords = async ({
     patientId,
     departmentId,
     downloadLink,
     isDownload,
     emailAddress,
     startDate,
     endDate,
     asHtml,
     note
}: DownloadMedicalRecordsProps): Promise<AsyncJobInfo> => {
     const url = `${patientsUrl}/documents/medical-records`;
     let data = {
          'departmentId': departmentId,
          'downloadLink': downloadLink,
          'emailAddress': emailAddress,
          'download': isDownload,
          'startDate': startDate,
          'endDate': endDate,
          'asHtml': asHtml,
          'patientId': patientId,
          'note': note
     };
     const response = await Api.post(url, data);
     return response.data;
}

export const checkMedicalRecordJobStatus = async (messageId: string): Promise<AsyncJobInfo> => {
     const url = `${patientsUrl}/documents/medical-records/${messageId}`;
     const result = await Api.get(url);
     return result.data;
}

export const downloadMedicalRecords = async ({linkId}: {linkId: string}) => {
     const url = `${patientsUrl}/documents/medical-records/${linkId}`;
     const response = await Api.get(url, {
          responseType: 'arraybuffer'
     });
     downloadFileFromData(response.data, "medical_records.zip");
     return response.data;
}

export const getMedicalRecordsAsHtml = async ({linkId}: {linkId: string}) => {
     const url = `${patientsUrl}/documents/medical-records/${linkId}/html`;
     const response = await Api.get(url);
     return response.data;
}

export const getPatientById = (patientId: string, queryParams?: GetPatientInfoRequest) => {
     const url = `${patientsUrl}/${patientId}`;
     return async (dispatch: Dispatch) => {
          dispatch(setPatientError(false));
          dispatch(setLoading(true));
          await Api.get(url, {params: queryParams})
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

export const getAppointments = async (patientId: number) => {
     const url = `${patientsUrl}/${patientId}/appointments`;
     const result = await Api.get(url);
     return result.data;
}

export const checkPatientVerification = async (request: CheckPatientVerification): Promise<PatientVerificationResponse> => {
     const url = `${patientsUrl}/verification/CheckPatientVerification`;
     const result = await Api.post(url, request);
     return result.data;
}

export const checkIfPatientExists = async (request: PatientExistsRequest): Promise<PatientExistsResponse> => {
     const url = `${patientsUrl}/verification/CheckIfPatientExist`;
     const result = await Api.post(url, request);
     return result.data;
}

export const sendVerificationCode = async (request: SendVerificationCodeRequest) => {
     const url = `${patientsUrl}/verification/SendVerificationCode`;
     const result = await Api.post(url, request);
     return result.data;
}

export const checkVerificationCode = async (request: CheckVerificationCodeRequest): Promise<PatientVerificationResponse> => {
     const url = `${patientsUrl}/verification/CheckVerificationCode`;
     const result = await Api.post(url, request);
     return result.data;
}

export const createPatient = async (request: CreatePatientRequest) => {
     const url = `${patientsUrl}/registration`;
     const {data} = await Api.post(url, request);
     return data;
}

const downloadFileFromData = (data: any, fileName: string) => {
     const blob = new Blob([data], {type: 'application/zip'});
     const objectUrl: string = URL.createObjectURL(blob);
     const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
     a.href = objectUrl;
     a.download = fileName;
     document.body.appendChild(a);
     a.click();
     document.body.removeChild(a);
     URL.revokeObjectURL(objectUrl);
}
