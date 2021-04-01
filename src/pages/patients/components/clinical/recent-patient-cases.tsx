import {useTranslation} from 'react-i18next';
import PatientChartList, {Row} from '@pages/patients/components/patient-chart-list';
import utils from '../../../../shared/utils/utils';
import {useSelector} from 'react-redux';
import {selectPatientClinical} from '../../store/patients.selectors';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';

const RecentPatientCases = () => {
    const {t} = useTranslation();
    const patientClinical = useSelector(selectPatientClinical);

    const recentPatientsCases: Row[] = [];

    patientClinical.patientCases.forEach(patientCase => {
            recentPatientsCases.push(
                {
                    label: utils.formatDateShortMonth(patientCase.createdDate),
                    values: [patientCase.subject, patientCase.patientCaseType]
                }
            )
        }
    );

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div>{t('patient.clinical.recent_patient_cases')} </div>
            </div>
            <div className='pt-3'>
                <PatientChartList rows={recentPatientsCases} dividerLine={true}/>
            </div>
        </div>
    );
};

export default withErrorLogging(RecentPatientCases);
