import Api from '../../../shared/services/api';
import {Note} from '@pages/patients/models/note';
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
import {GetPatientInfoRequest} from '@shared/models/get-patient-info-request.model';
import {CreatePatientRequest} from '@pages/external-access/models/create-patient-request.model';
import {VerifiedPatient} from '@pages/patients/models/verified-patient';
import utils from '@shared/utils/utils';
import {Appointment} from '@pages/external-access/appointment/models';
import {CreatePatientResponseModel} from '@pages/external-access/layout/create-patient-response.model';
import {ChartAlert} from '../models/chart-alert';
import {PatientChartAppointments} from '../models/patient-chart-appointments.model';
import {PatientCase} from '../models/patient-case';
import {Insurance} from '../models/insurance';
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
          workPhone: data.workPhone,
          address: data.address,
          address2: data.address2,
          homePhone: data.homePhone,
          city: data.city,
          contactPreference: data.contactPreference,
          state: data.state,
          zip: data.zip,
          consentToText: data.consentToText === 'true',
          email: data.email
     });
     return result.data;
}



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

export const getPatientInsurance = async (patientId: number) : Promise<Insurance[]> => {
     const url = `${patientsUrl}/${patientId}/insurance`;
     const result = await Api.get(url);
     return result.data;
}

export const getPatientByIdWithQuery = async (patientId: number, queryParams?: GetPatientInfoRequest): Promise<ExtendedPatient> => {
     const url = `${patientsUrl}/${patientId}`;
     const response = await Api.get(url, {params: queryParams});
     return response.data;
}

export const getPatientPhoto = async (patientId: number): Promise<string> => {
     const url = `${patientsUrl}/${patientId}/photo`;
     const response = await Api.get(url);
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
     utils.downloadFileFromData(response.data, 'medical_records.zip', 'application/zip');
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
                         dispatch(setPatientError(true));
                         dispatch(clearPatient());
                    }
               })
               .finally(() => {
                    dispatch(setLoading(false));
               })
     }
}

export const getAppointments = async (patientId: number): Promise<Appointment[]> => {
     const url = `${patientsUrl}/${patientId}/appointments`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentsForPatientChart = async (patientId: number) : Promise<PatientChartAppointments> => {
     const url = `${patientsUrl}/${patientId}/chart/appointments`;
     const result = await Api.get(url);
     return result.data;
}

export const getPatientCases = async ({patientId, departmentId}:{patientId: number, departmentId: number}) : Promise<PatientCase[]> => {
     const url = `${patientsUrl}/${patientId}/cases`;
     const result = await Api.get(url, {
          params: {
               departmentId
          }
     });
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

export const upsertPatient = async (request: CreatePatientRequest): Promise<CreatePatientResponseModel> => {
     const url = `${patientsUrl}/registration`;
     const {data} = await Api.post(url, request);
     return data;
}

export const verifyPatient = async (dob: string, mobilePhoneNumber: string, zip: string): Promise<VerifiedPatient> => {
     const url = `${patientsUrl}/verify`;
     const {data} = await Api.get(url, {
          params: {
               "dateOfBirth": dob,
               "phoneNumber": mobilePhoneNumber,
               "zipCode": zip,
               "forceSingleReturn": "true"
          }
     });
     return data;
}

export const getPatientChartAlert = async (patientId: number, departmentId: number) : Promise<ChartAlert> => {
     const url = `${patientsUrl}/${patientId}/chartalert`;
     const {data} = await Api.get(url, {
          params: {
               "departmentId": departmentId
          }
     });
     return data;
}