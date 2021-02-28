import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectPatientClinical } from '../../store/patients.selectors';
import AppointmentDisplay from '../appointment-display';

const Appointments = () => {
    const { t } = useTranslation();
    const patientClinical = useSelector(selectPatientClinical);

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div className={'font-bold text-lg'}>{t('patient.summary.appointments')} </div>
            </div>
            <div>
                <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.last_appointment')}</div>
                {patientClinical.lastAppointment && <AppointmentDisplay appointment={patientClinical.lastAppointment} />}
                <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.upcoming_appointments')}</div>
                {
                    patientClinical.upcomingAppointments.length > 0 ?
                        patientClinical.upcomingAppointments.map(ua => <AppointmentDisplay appointment={ua} border={true} />
                        )
                        : null
                }
            </div>
        </div>
    );
};

export default Appointments;
