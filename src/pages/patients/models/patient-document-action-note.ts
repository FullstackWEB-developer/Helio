export interface PatientDocumentActionNote {
  patientId: number;
  actionNote: string;
  assignedTo: string;
  createdBy: string;
  createdDateTime: Date;
  priority: number;
  status: string;
}
