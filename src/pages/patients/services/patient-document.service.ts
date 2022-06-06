import Api from "@shared/services/api";
import {PatientDocumentActionNote} from "../models/patient-document-action-note";
import {PatientCaseDocument} from "../models/patient-case-document";
const documentUrl = "/patients";

export const getPatientActionNotes = async (
  patientCaseId: number
): Promise<PatientDocumentActionNote[]> => {
  const url = `${documentUrl}/documents/patientcase/${patientCaseId}/actionnotes`;
  const response = await Api.get(url);
  return response.data;
};

export const getPatientCaseDocument = async (
  patientId: number,
  patientCaseId: number
): Promise<PatientCaseDocument> => {
  const url = `${documentUrl}/${patientId}/documents/patientcase/${patientCaseId}`;
  const response = await Api.get(url);
  return response.data;
};

export const uploadPatientRegistrationImage = async ({file, imageUploadTag, label}: {file: File, imageUploadTag: string, label: string}) => {
  const url = `${documentUrl}/documents/registration/upload-patient-files`;
  const options = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  let formData = new FormData();
  formData.append('imageUploadTag', imageUploadTag);
  formData.append('file', file);
  formData.append('label', label);
  const {data} = await Api.post(url, formData, options);
  return data;
}