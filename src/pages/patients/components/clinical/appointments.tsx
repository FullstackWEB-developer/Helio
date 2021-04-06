import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPatientClinical } from '../../store/patients.selectors';
import AppointmentDisplay from '../appointment-display';
import { useQuery } from 'react-query';
import { getAppointmentNotes } from '@pages/appointments/services/appointments.service';
import { AppointmentNote, AppointmentNoteInfo } from '@pages/appointments/models/note.model';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import { Appointment } from '@pages/external-access/appointment/models/appointment';

const Appointments = () => {
    const { t } = useTranslation();
    let patientClinical = useSelector(selectPatientClinical);

    const {isLoading, error, data} = useQuery<AppointmentNoteInfo[], Error>("appointmentNotes", () =>
            getAppointmentNotes(patientClinical.upcomingAppointments),
        {
            staleTime: 60000
        }
    );

    let upcomingAppointmentsView = () => {
        let upcomingAppointments = patientClinical.upcomingAppointments.map(upcomingAppointment => {
           return {
               ...upcomingAppointment,
               notes: data ? data.find(appointmentNote => appointmentNote.appointmentId.toString() === upcomingAppointment.appointmentId)?.notes : [] as AppointmentNote[]
            }
        });
        return upcomingAppointments.map((ua: Appointment) => <AppointmentDisplay key={ua.appointmentId} appointment={ua} border={true} isLast={false} isDetailed={true}/>)
    };

    const getContent = () => {
        if (isLoading) {
            return <ThreeDots/>;
        }
        if (error) {
            return <div data-test-id='appointment-notes-error'>
                {error.message} - {t('appointment.notes.error')}
            </div>;
        }
        return upcomingAppointmentsView();
    }

    const displayUpcomingAppointment = () => {
        if (patientClinical.upcomingAppointments.length > 0) {
            return getContent();
        } else {
            return <div>{t('patient.summary.no_upcoming_appointment')}</div>;
        }
    }

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div>{t('patient.summary.appointments')} </div>
            </div>
            <div>
                <div className='h8 pt-6 pb-3'>{t('patient.summary.last_appointment')}</div>
                {patientClinical.lastAppointment && <AppointmentDisplay appointment={patientClinical.lastAppointment} isLast={true}/>}
                <div className='h8 pt-6 pb-3'>{t('patient.summary.upcoming_appointments')}</div>
                    {displayUpcomingAppointment()}
            </div>
        </div>
    );
};

export default Appointments;
