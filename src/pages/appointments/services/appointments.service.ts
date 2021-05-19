import Api from '../../../shared/services/api';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import dayjs from 'dayjs';
import {AppointmentCancellationModel} from '@pages/external-access/appointment/models/appointment-cancellation.model';

const itemCount = 100;
const appointmentsBaseUrl = '/appointments';

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

export const getAppointmentTypeById = async (appointmentTypeId: number) => {
     const url = `${appointmentsBaseUrl}/appointmenttypes/${appointmentTypeId}`;
     const result = await Api.get(url);
     return result.data;
}

export const getAppointmentSlots = async (providerId: number, departmentId: number, appointmentTypeId: number, startDate: Date, endDate: Date) => {
     let getOpenSlotsUrl = `${appointmentsBaseUrl}/open-slots?ignoreschedulablepermission=true`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&departmentId=${departmentId}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&providerId=${providerId}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&appointmentTypeId=${appointmentTypeId}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&startDate=${dayjs(startDate).utc().format('YYYY-MM-DD')}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&endDate=${dayjs(endDate).utc().format( 'YYYY-MM-DD')}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&itemCount=${itemCount}`;
     const result = await Api.get(getOpenSlotsUrl);
     return result.data;
}

export interface RescheduleAppointmentProps {
     appointmentId: number;
     newAppointmentId: number;
     patientId: number;
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
     const url = `${appointmentsBaseUrl}/cancellation-reasons`;
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
