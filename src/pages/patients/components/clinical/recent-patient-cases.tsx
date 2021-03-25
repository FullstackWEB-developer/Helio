import {useTranslation} from 'react-i18next';
import OldTable, {Row} from '@components/old-table/old-table';
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
            { label: utils.formatDate(patientCase.createdDate), values: [patientCase.subject, patientCase.patientCaseType] }
        )
    }
    );

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div className={'font-bold text-lg'}>{t('patient.clinical.recent_patient_cases')} </div>
            </div>
            <div className='pt-3'>
                <OldTable
                    headings={[t('patient.clinical.date'), t('patient.clinical.case_description'), t('patient.clinical.originated_by')]}
                    rows={recentPatientsCases} dividerLine={true}/>
            </div>
        </div>
    );
};

export default withErrorLogging(RecentPatientCases);
