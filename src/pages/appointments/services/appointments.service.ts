import Api from '../../../shared/services/api';
import { Appointment } from '@pages/external-access/appointment/models/appointment.model';
import dayjs from 'dayjs';
import {AppointmentCancellationModel} from '@pages/external-access/appointment/models/appointment-cancellation.model';

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
     getOpenSlotsUrl = getOpenSlotsUrl + `&startDate=${dayjs(startDate, 'YYYY/MM/DD')}`;
     getOpenSlotsUrl = getOpenSlotsUrl + `&endDate=${dayjs(endDate, 'YYYY/MM/DD')}`;
     const result = await Api.get(getOpenSlotsUrl);
     return result.data;
}

export const getCancellationReasons = async () => {
     let url = `${appointmentsBaseUrl}/cancellation-reasons`;
     const result = await Api.get(url);
     return result.data;
}

export interface CancelAppointmentProps {
     appointmentId: number;
     data: AppointmentCancellationModel;
}

export const cancelAppointment = async ({appointmentId, data}: CancelAppointmentProps) => {
     let url = `${appointmentsBaseUrl}/${appointmentId}/cancel`;
     const result = await Api.put(url, {
          patientId: data.patientId,
          appointmentCancelReasonId: +data.appointmentCancelReasonId,
          cancellationReason: data.cancellationReason
     });
     return result.data;
}
