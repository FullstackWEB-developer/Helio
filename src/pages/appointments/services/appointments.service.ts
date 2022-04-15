import Api from '../../../shared/services/api';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import {ConfirmationStatus} from '@pages/external-access/appointment/models/appointment-confirmation-status.enum';
import utils from '@shared/utils/utils';
import {AppointmentCancellationModel} from '@pages/external-access/appointment/models/appointment-cancellation.model';
import {AppointmentSlotRequest, AppointmentType} from '@pages/external-access/appointment/models';
import {CreateAppointmentRequest} from '../models/create-appointment-request';
const itemCount = 100;
const appointmentsBaseUrl = '/appointments';

export const getAppointmentById = async (appointmentId: string) => {
     const {data} = await Api.get(`${appointmentsBaseUrl}/${appointmentId}`);
     return data;
}

export const getHotSpots = async () => {
     const url = `${appointmentsBaseUrl}/hotspots`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentNotes = async (appointments: Appointment[]) => {
     const appointmentIds = appointments.map(appointment => {
          return `id=${appointment.appointmentId}`;
     }).join('&');
     const url = `${appointmentsBaseUrl}/notes?${appointmentIds}`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentTypeById = async (appointmentTypeId: number): Promise<AppointmentType> => {
     const url = `${appointmentsBaseUrl}/appointmenttypes/${appointmentTypeId}`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentTypes = async (): Promise<AppointmentType[]> => {
     const url = `${appointmentsBaseUrl}/appointmenttypes`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentTypesForPatient = async (patientId: number, providerId: number): Promise<AppointmentType[]> => {
     const url = `${appointmentsBaseUrl}/patient-appointment-types`;
     const result = await Api.get(url, {
          params: {
               patientId,
               providerId
          }
     });
     return result.data;
}

export const getAppointmentSlots = async (params: AppointmentSlotRequest, limitItemCount: boolean = true) => {
     const url = `${appointmentsBaseUrl}/open-slots`;

     var urlParams = new URLSearchParams();

     if (params.departmentId) {
          urlParams.append("departmentId", params.departmentId.toString());
     }
     if (params.patientId) {
          urlParams.append("patientId", params.patientId.toString());
     }
     if (params.providerId && params.providerId.length > 0) {
          params.providerId.filter(a => a > 0).forEach(p => urlParams.append("providerId", p.toString()));
     }
     if (params.allowMultipleDepartment) {
          urlParams.append("allowMultipleDepartment", "true");
     }
     if (params.patientDefaultDepartmentId) {
          urlParams.append("patientDefaultDepartmentId", params.patientDefaultDepartmentId.toString());
     }
     if (params.patientDefaultProviderId) {
          urlParams.append("patientDefaultProviderId", params.patientDefaultProviderId.toString());
     }
     if (params.timeOfDays && params.timeOfDays.length > 0) {
          params.timeOfDays.forEach(p => urlParams.append("timeOfDays", p.toString()));
     }
     if (limitItemCount) {
          urlParams.append("itemCount", itemCount.toString());
     }
     urlParams.append("startDate", utils.toShortISOLocalString(params.startDate));
     urlParams.append("endDate", utils.toShortISOLocalString(params.endDate));
     urlParams.append("ignoreSchedulablePermission", "true");
     urlParams.append("appointmentTypeId", params.appointmentTypeId.toString());


     const result = await Api.get(url, {params: urlParams});
     return result.data;
}

export interface RescheduleAppointmentProps {
     appointmentId: number;
     newAppointmentId: number;
     patientId: number;
}

export const scheduleAppointment = async (request: CreateAppointmentRequest) => {
     const {data} = await Api.post(appointmentsBaseUrl, request);
     return data;
}

export const rescheduleAppointment = async ({appointmentId, newAppointmentId, patientId}: RescheduleAppointmentProps) => {
     const url = `${appointmentsBaseUrl}/${appointmentId}/reschedule`;
     const result = await Api.put(url, {
          newAppointmentId,
          patientId
     });
     return result.data;
}

export const getCancellationReasons = async () => {
     const url = `${appointmentsBaseUrl}/cancellationreason`;
     const result = await Api.get(url);
     return result.data;
}

export const getCancellationReasonsEditable = async () => {
     const url = `${appointmentsBaseUrl}/cancellationreason/editable-cancellation-reasons`;
     const result = await Api.get(url);
     return result.data;
}

export interface CancelAppointmentProps {
     appointmentId: number;
     data: AppointmentCancellationModel;
}

export const cancelAppointment = async ({appointmentId, data}: CancelAppointmentProps) => {
     const url = `${appointmentsBaseUrl}/${appointmentId}/cancel`;
     const result = await Api.put(url, {
          patientId: data.patientId,
          appointmentCancelReasonId: +data.appointmentCancelReasonId,
          cancellationReason: data.cancellationReason
     });
     return result.data;
}

export const confirmAppointment = async({appointmentId, confirmationStatus}:{appointmentId: string, confirmationStatus: ConfirmationStatus}) => {
     const url = `${appointmentsBaseUrl}/${appointmentId}/confirm`;
     const {data} = await Api.put(url, undefined, {
          params: {
               confirmationStatus
          }
     });
     return data;
}
