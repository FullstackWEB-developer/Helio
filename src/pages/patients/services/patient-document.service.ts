import Api from "@shared/services/api";
import { PatientDocumentActionNote } from "../models/patient-document-action-note";
import { PatientCaseDocument } from "../models/patient-case-document";

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
