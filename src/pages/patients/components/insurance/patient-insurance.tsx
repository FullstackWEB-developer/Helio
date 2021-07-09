import {useTranslation} from 'react-i18next';
import PatientChartList from '@pages/patients/components/patient-chart-list';
import { useSelector} from 'react-redux';
import {
    selectPatient,
} from '../../store/patients.selectors';
import patientUtils from '@pages/patients/utils/utils';
import utils from '../../../../shared/utils/utils';
import {getPatientInsurance} from '@pages/patients/services/patients.service';
import {useQuery} from 'react-query';
import {GetPatientInsurance, OneMinute} from '@constants/react-query-constants';
import {Insurance} from '@pages/patients/models/insurance';
import Spinner from '@components/spinner/Spinner';

export interface PatientInsuranceProps {
    patientId : number;
}

const PatientInsurance = ({patientId}: PatientInsuranceProps) => {
    const { t } = useTranslation();
    const patient = useSelector(selectPatient);

    const {isLoading, isError, data: patientInsurance} = useQuery<Insurance[], Error>([GetPatientInsurance, patientId], () =>
            getPatientInsurance(patientId),
        {
            staleTime: OneMinute
        }
    );

    const primaryInsurance = (!patientInsurance || patientInsurance.length === 0) ? undefined : patientInsurance[0];

    const copay = patientInsurance && patientInsurance?.length > 0 ? `  $${patientInsurance[0].copayAmount}` : '';

    const primaryInsuranceHeader = primaryInsurance ? `${patientUtils.getPrimaryInsuranceHeader(primaryInsurance, t('common.not_available'))} ` : '';

    const getPolicyHolder = () => {
        if (primaryInsurance !== undefined) {
            if (primaryInsurance.insuredLastName && primaryInsurance.insuredFirstName) {
                return `${primaryInsurance.insuredLastName},${primaryInsurance.insuredFirstName}`
            } else {
                return primaryInsurance.insurancePolicyHolder;
            }
        }
        return '';
    }

    const policyInfoRows = primaryInsurance !== undefined
        ? [
            { label: t('patient.insurance.policy_holder'), values: [getPolicyHolder()] },
            { label: t('patient.insurance.patients_relation'), values: [primaryInsurance.relationshipToInsured] },
            { label: t('patient.insurance.dob'), values: [utils.formatDate(patient?.dateOfBirth.toString())] },
            { label: t('patient.insurance.group'), values: [primaryInsurance.policyNumber] },
            { label: t('patient.insurance.id_cert'), values: [primaryInsurance.insuranceIdNumber] }
        ]
        : [];

    const eligibilityInfoRows = primaryInsurance !== undefined
        ? [
            {label: t('patient.insurance.status'), values: [primaryInsurance.eligibilityStatus], isStatus: true},
            {label: t('patient.insurance.status_reason'), values: [primaryInsurance.eligibilityReason]},
            {
                label: t('patient.insurance.pcp'),
                values: [primaryInsurance.insuredPcp || t('patient.insurance.unknown')]
            },
            {label: t('patient.insurance.inquiry_date'), values: [primaryInsurance.eligibilityLastChecked]},
            {label: t('patient.insurance.message'), values: [primaryInsurance.eligibilityMessage]},
            {
                label: t('patient.insurance.plan_name'),
                values: [primaryInsurance.insurancePlanDisplayName || t('patient.insurance.unknown')]
            }
        ]
        : [];

    const displayInsurance = () => {
        return <div>
            <div className='pt-4'>
                <span>
                    {primaryInsurance?.insurancePlanName || ''} {primaryInsuranceHeader}
                    {
                        primaryInsurance?.insurancePhone && <span>{`${t('patient.insurance.phone')}: ${primaryInsurance.insurancePhone}`}</span>
                    }
                    <span className='ml-3'>{t('patient.insurance.copay')}</span>
                    <span className='subtitle2'>{copay}</span>
                </span>
            </div>
            <div className='grid grid-cols-2 pt-4'>
                <PatientChartList headings={[t('patient.insurance.policy_info')]} rows={policyInfoRows}/>
                <PatientChartList headings={[t('patient.insurance.eligibility_info')]} rows={eligibilityInfoRows}/>
            </div>
        </div>
    }

    return (!isLoading && !isError ?
        <div>
            <div className='grid grid-cols-1 border-b pb-1 pt-8'>
                <div>{t('patient.summary.primary_insurance_information')}</div>
            </div>
            {
                primaryInsurance !== undefined
                    ? displayInsurance()
                    : <div>{t('patient.insurance.no_insurance')}</div>
            }
            <div hidden={!isError} className={'p-4 text-danger'}>{t('patient.insurance.error')}</div>
        </div> : !isError ? <Spinner fullScreen /> : <div className={'p-4 text-danger'}>{t('patient.summary.error')}</div>
    );
};

export default PatientInsurance;
