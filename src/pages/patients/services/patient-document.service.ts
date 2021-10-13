import Api from "@shared/services/api";
import {PatientDocumentActionNote} from "../models/patient-document-action-note";
import {PatientCaseDocument} from "../models/patient-case-document";
import {PatientRegistrationDocuments} from "../models/patient-registration-documents";
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

export const uploadPatientRegistrationImages = async (files: PatientRegistrationDocuments) => {
  const url = `${documentUrl}/documents/registration/upload-patient-files`;
  let formData = new FormData();
  formData.append('DriversLicense', files.driversLicenseImage);
  formData.append('InsuranceCardRequired', files.insuranceFrontImage && files.insuranceBackImage ? "true" : "false");
  if (files.insuranceFrontImage && files.insuranceBackImage) {
    formData.append('InsuranceCardFront', files.insuranceFrontImage);
    formData.append('InsuranceCardBack', files.insuranceBackImage);
  }
  const {data} = await Api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
}