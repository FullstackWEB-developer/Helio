import {useTranslation} from 'react-i18next';
import AppointmentDisplay from '../appointment-display';
import {useQuery} from 'react-query';
import {getAppointmentNotes} from '@pages/appointments/services/appointments.service';
import {AppointmentNote, AppointmentNoteInfo} from '@pages/appointments/models/note.model';
import {Appointment} from '@pages/external-access/appointment/models/appointment.model';
import Spinner from '@components/spinner/Spinner';
import {GetPatientAppointments} from '@constants/react-query-constants';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';
import {selectPatient} from '@pages/patients/store/patients.selectors';
import {useSelector} from 'react-redux';
import {getAppointmentsForPatientChart} from '@pages/patients/services/patients.service';

const Appointments = () => {
    const {t} = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);

    const {data: appointments, isFetching: isFetchingAppointments} = useQuery([GetPatientAppointments, patient.patientId],
        () => getAppointmentsForPatientChart(patient.patientId),
        {
            enabled: !!patient.patientId
        });

    const {isLoading, error, data} = useQuery<AppointmentNoteInfo[], Error>("appointmentNotes", () =>
        getAppointmentNotes(appointments?.upcomingAppointments),
        {
            enabled: !!appointments && appointments.upcomingAppointments && appointments.upcomingAppointments.length > 0
        }
    );

    let upcomingAppointmentsView = () => {
        let upcomingAppointments = appointments?.upcomingAppointments.map((upcomingAppointment: Appointment) => {
            return {
                ...upcomingAppointment,
                notes: data ? data.find(appointmentNote => appointmentNote.appointmentId.toString() === upcomingAppointment.appointmentId)?.notes : [] as AppointmentNote[]
            }
        });
        return upcomingAppointments?.map((ua: Appointment) => <AppointmentDisplay key={ua.appointmentId} appointment={ua} border={true} isLast={false} />)
    };

    const getContent = () => {
        if (isLoading) {
            return <Spinner fullScreen />;
        }
        if (error) {
            return <div data-test-id='appointment-notes-error'>
                {error.message} - {t('appointment.notes.error')}
            </div>;
        }
        return upcomingAppointmentsView();
    }

    const displayLastAppointment = () => {
        if (appointments?.lastAppointment) {
            return <AppointmentDisplay appointment={appointments.lastAppointment} isLast={false} />
        } else {
            return <div>{t('patient.clinical.no_last_appointment')}</div>;
        }
    }

    const displayUpcomingAppointment = () => {
        if (appointments && appointments.upcomingAppointments.length > 0) {
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
                {
                    isFetchingAppointments ? <Spinner className='pt-8' fullScreen/> :
                        <>
                            <div className='h8 pt-6 pb-2'>{t('patient.summary.last_appointment')}</div>
                            {displayLastAppointment()}
                            <div className='h8 pt-5 pb-2'>{t('patient.summary.upcoming_appointments')}</div>
                            {displayUpcomingAppointment()}
                        </>
                }
            </div>
        </div>
    );
};

export default Appointments;
