export interface PatientCaseRequest {
  patientId: number;
  departmentId: number;
  offset?: number;
  limit?: number;
}
