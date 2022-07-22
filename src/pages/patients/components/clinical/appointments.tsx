import { useTranslation } from 'react-i18next';
import AppointmentDisplay from '../appointment-display';
import { useQuery } from 'react-query';
import { getAppointmentNotes } from '@pages/appointments/services/appointments.service';
import { AppointmentNote, AppointmentNoteInfo } from '@pages/appointments/models/note.model';
import { Appointment } from '@pages/external-access/appointment/models/appointment.model';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import {GetAppointmentNotes, OneMinute} from '@constants/react-query-constants';

export interface AppointmentsProps {
    clinical: ClinicalDetails
}
const Appointments = ({clinical} : AppointmentsProps) => {
    const { t } = useTranslation();

    const {data} = useQuery<AppointmentNoteInfo[], Error>([GetAppointmentNotes, clinical.upcomingAppointments], () =>
            getAppointmentNotes(clinical.upcomingAppointments),
        {
            enabled: !!clinical,
            refetchInterval: OneMinute
        }
    );

    let upcomingAppointmentsView = () => {
        let upcomingAppointments = clinical.upcomingAppointments.map((upcomingAppointment: Appointment) => {
           return {
               ...upcomingAppointment,
               notes: data ? data.find(appointmentNote => appointmentNote.appointmentId.toString() === upcomingAppointment.appointmentId)?.notes : [] as AppointmentNote[]
            }
        });
        return upcomingAppointments.map((ua: Appointment) => <AppointmentDisplay key={ua.appointmentId} appointment={ua} border={true} isLast={false} isDetailed={true}/>)
    };

    const getContent = () => {
        return upcomingAppointmentsView();
    }

    const displayLastAppointment = () => {
        if (clinical.lastAppointment) {
            return <AppointmentDisplay appointment={clinical.lastAppointment} isLast={false}/>
        } else {
            return <div>{t('patient.clinical.no_last_appointment')}</div>;
        }
    }

    const displayUpcomingAppointment = () => {
        if (clinical.upcomingAppointments.length > 0) {
            return getContent();
        } else {
            return <div>{t('patient.clinical.no_upcoming_appointments')}</div>;
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-2 pt-8'>
                <div>{t('patient.summary.appointments')} </div>
            </div>
            <div>
                <div className='h8 pt-6 pb-2'>{t('patient.summary.last_appointment')}</div>
                {displayLastAppointment()}
                <div className='h8 pt-5 pb-2'>{t('patient.summary.upcoming_appointments')}</div>
                {displayUpcomingAppointment()}
            </div>
        </div>
    );
};

export default Appointments;
