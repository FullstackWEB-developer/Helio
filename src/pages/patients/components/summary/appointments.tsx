import {useTranslation} from 'react-i18next';
import PatientChartList, {Row} from '@pages/patients/components/patient-chart-list';
import utils from '../../../../shared/utils/utils';
import AppointmentDisplay from '../appointment-display';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';

export interface AppointmentsProps {
    patientChartSummary: PatientChartSummary;
}
const Appointments = ({patientChartSummary} : AppointmentsProps) => {
    const {t} = useTranslation();
    const recentPatientsCases: Row[] = [];

    patientChartSummary.patientCases.slice(0, 5).forEach(patientCase => {
        recentPatientsCases.push(
            { label: utils.formatDateShortMonth(patientCase.createdDate), values: [patientCase.subject] }
        )
    }
    );

    const displayLastAppointment = () => {
        if (patientChartSummary.lastAppointment) {
            return <AppointmentDisplay appointment={patientChartSummary.lastAppointment} isLast={true}/>;
        } else {
            return <div>{t('patient.summary.no_last_appointment')}</div>;
        }
    }

    const displayUpcomingAppointment = () => {
        if (patientChartSummary.upcomingAppointment) {
            return <AppointmentDisplay appointment={patientChartSummary.upcomingAppointment}/>;
        } else {
            return <div>{t('patient.summary.no_upcoming_appointment')}</div>;
        }
    }

    return (
        <div className='grid grid-cols-2 gap-12 pt-8'>
            <div>
                <div className='body1 border-b pb-2'>{t('patient.summary.appointments')}</div>
                <div>
                    <div className='h8 pt-6 pb-2'>{t('patient.summary.last_appointment')}</div>
                    {displayLastAppointment()}
                    <div className='h8 pt-5 pb-2'>{t('patient.summary.upcoming_appointment')}</div>
                    {displayUpcomingAppointment()}
                </div>
            </div>
            <div>
                <div className='body1 border-b pb-2'>{t('patient.summary.recent_patient_cases')}</div>
                <div className='pt-3'>
                    <PatientChartList rows={recentPatientsCases} dividerLine={true} isLongValue={true}/>
                </div>
            </div>
        </div>
    );
};

export default withErrorLogging(Appointments);
