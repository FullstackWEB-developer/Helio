import {Appointment} from "@pages/external-access/appointment/models/appointment.model";

export interface PatientChartAppointments {
      lastAppointment: Appointment;
      upcomingAppointments: Appointment[];
}