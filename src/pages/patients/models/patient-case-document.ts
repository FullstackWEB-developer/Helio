export interface PatientCaseDocument {
  priority: number;
  assignedTo: string;
  documentClass: string;
  createdDateTime: Date;
  departmentId: string;
  patientCaseId: string;
  subject: string;
  createdUser: string;
  patientId: number;
  description: string;
  documentRoute: string;
  documentSource: string;
  lastModifiedUser: string;
  callBackNumber: string;
  status: string;
  documentDescription: string;
  providerId: number;
  providerName: string;
  lastModifiedDataTime: Date;
  callBackNumberType: string;
  documentSubClass: string;
  createdDocuments: number[];
}
