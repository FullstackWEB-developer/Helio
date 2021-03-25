import {useSelector} from 'react-redux';
import {selectPatientChartSummary} from '../../store/patients.selectors';
import {useTranslation} from 'react-i18next';
import OldTable, {Row} from '@components/old-table/old-table';
import utils from '../../../../shared/utils/utils';
import AppointmentDisplay from '../appointment-display';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';

const Appointments = () => {
    const {t} = useTranslation();
    const patientChartSummary = useSelector(selectPatientChartSummary);

    const recentPatientsCases: Row[] = [];

    patientChartSummary.patientCases.slice(0, 5).forEach(patientCase => {
        recentPatientsCases.push(
            { label: utils.formatDate(patientCase.createdDate), values: [patientCase.subject] }
        )
    }
    );

    const displayLastAppointment = () => {
        if (patientChartSummary.lastAppointment) {
            return <AppointmentDisplay appointment={patientChartSummary.lastAppointment} />;
        } else {
            return <div>{t('patient.summary.no_last_appointment')}</div>;
        }
    }

    const displayUpcomingAppointment = () => {
        if (patientChartSummary.upcomingAppointment) {
            return <AppointmentDisplay appointment={patientChartSummary.upcomingAppointment} />;
        } else {
            return <div>{t('patient.summary.no_upcoming_appointment')}</div>;
        }
    }

    return (
        <div className='grid grid-cols-2 gap-12 pt-8'>
            <div>
                <div className='font-bold text-lg border-b pb-1'>{t('patient.summary.appointments')}</div>
                <div>
                    <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.last_appointment')}</div>
                    {displayLastAppointment()}
                    <div className='text-gray-400 pt-6 pb-3'>{t('patient.summary.upcoming_appointment')}</div>
                    {displayUpcomingAppointment()}
                </div>
            </div>
            <div>
                <div className='font-bold text-lg border-b pb-1'>{t('patient.summary.recent_patient_cases')}</div>
                <div className='pt-3'>
                    <OldTable headings={[t('patient.summary.date'), t('patient.summary.case_description')]}
                              rows={recentPatientsCases} dividerLine={true}/>
                </div>
            </div>
        </div>
    );
};

export default withErrorLogging(Appointments);
