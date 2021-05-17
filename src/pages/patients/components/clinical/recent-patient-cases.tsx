import {useTranslation} from 'react-i18next';
import PatientChartList, {Row} from '@pages/patients/components/patient-chart-list';
import utils from '../../../../shared/utils/utils';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import ThreeDots from '@components/skeleton-loader/skeleton-loader';
import {ClinicalDetails} from '@pages/patients/models/clinical-details';
import {PatientCase} from '@pages/patients/models/patient-case';

export interface RecentPatientCasesProps {
    clinical : ClinicalDetails;
}

const RecentPatientCases = ({clinical}: RecentPatientCasesProps) => {
    const {t} = useTranslation();

    const recentPatientsCases: Row[] = [];

    if (clinical?.patientCases) {
        clinical.patientCases.forEach((patientCase: PatientCase) => {
                recentPatientsCases.push(
                    {
                        label: utils.formatDateShortMonth(patientCase.createdDate),
                        values: [patientCase.subject, patientCase.patientCaseType]
                    }
                )
            }
        );
    }

    if (!clinical) {
        return <ThreeDots/>;
    }

    return (
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div>{t('patient.clinical.recent_patient_cases')} </div>
            </div>
            <div className='pt-3'>
                {(!recentPatientsCases || recentPatientsCases.length === 0) &&
                <div className='pt-2'>{t('patient.summary.no_patient_cases')}</div>}
                <PatientChartList rows={recentPatientsCases} dividerLine={true}/>
            </div>
        </div>
    );
};

export default withErrorLogging(RecentPatientCases);
