import Api from '../../../shared/services/api';
import { Appointment } from '@pages/external-access/appointment/models/appointment';

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
