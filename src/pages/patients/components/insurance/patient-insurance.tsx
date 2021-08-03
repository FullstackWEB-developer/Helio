import {useTranslation} from 'react-i18next';
import PatientChartList from '@pages/patients/components/patient-chart-list';
import { useSelector} from 'react-redux';
import {
    selectPatient,
} from '../../store/patients.selectors';
import patientUtils from '@pages/patients/utils/utils';
import utils from '../../../../shared/utils/utils';
import {Insurance} from '@pages/patients/models/insurance';

const PatientInsurance = () => {
    const { t } = useTranslation();
    const patient = useSelector(selectPatient);

    const primaryInsuranceHeader = (insurance: Insurance) => patientUtils.getInsuranceHeader(insurance, t('common.not_available'));

    const getPolicyHolder = (insurance: Insurance) => {
        if (insurance !== undefined) {
            if (insurance.insuredLastName && insurance.insuredFirstName) {
                return `${insurance.insuredLastName},${insurance.insuredFirstName}`
            } else {
                return insurance.insurancePolicyHolder;
            }
        }
        return '';
    }

    const getPolicyInfoRows = (insurance: Insurance) => {
        return [
            { label: t('patient.insurance.policy_holder'), values: [getPolicyHolder(insurance)] },
            { label: t('patient.insurance.patients_relation'), values: [insurance.relationshipToInsured] },
            { label: t('patient.insurance.dob'), values: [utils.formatDate(patient?.dateOfBirth.toString())] },
            { label: t('patient.insurance.group'), values: [insurance.policyNumber] },
            { label: t('patient.insurance.id_cert'), values: [insurance.insuranceIdNumber] }
        ];
    }

    const getEligibilityInfoRows = (insurance: Insurance) => {
        return [
            {label: t('patient.insurance.status'), values: [insurance.eligibilityStatus], isStatus: true},
            {label: t('patient.insurance.status_reason'), values: [insurance.eligibilityReason]},
            {
                label: t('patient.insurance.pcp'),
                values: [insurance.insuredPcp || t('patient.insurance.unknown')]
            },
            {label: t('patient.insurance.inquiry_date'), values: [insurance.eligibilityLastChecked]},
            {label: t('patient.insurance.message'), values: [insurance.eligibilityMessage]},
            {
                label: t('patient.insurance.plan_name'),
                values: [insurance.insurancePlanDisplayName || t('patient.insurance.unknown')]
            }
        ];
    }

    const Insurance = ({insurance} : {insurance: Insurance}) => {
        return <div>
            <div className='pt-4'>
                <span>
                    {insurance?.insurancePlanName || ''} {primaryInsuranceHeader}
                    {
                        insurance?.insurancePhone && <span>{`${t('patient.insurance.phone')}: ${insurance.insurancePhone}`}</span>
                    }
                    <span className='ml-3'>{t('patient.insurance.copay')}</span>
                    <span className='subtitle2'>{insurance.copayAmount}</span>
                </span>
            </div>
            <div className='grid grid-cols-2 pt-4'>
                <PatientChartList headings={[t('patient.insurance.policy_info')]} rows={getPolicyInfoRows(insurance)}/>
                <PatientChartList headings={[t('patient.insurance.eligibility_info')]} rows={getEligibilityInfoRows(insurance)}/>
            </div>
        </div>
    }

    if (patient.insurances && patient.insurances.length === 0) {
        return <div className='pt-4'>{t('patient.insurance.no_insurance')}</div>;
    }

    const InsuranceTitle = ({title} : {title: string}) => {
        return <div className='grid grid-cols-1 border-b pb-1 pt-8'>
            <div>{t(title)}</div>
        </div>
    }

    const primaryInsurance = patient.insurances.find(a => a.sequenceNumber === 1);

    const nonSeqInsurances = patient.insurances.filter(a => a.sequenceNumber === 0);

    const secondaryInsurances = patient.insurances.filter(a => a.sequenceNumber > 1);

    return <div>

        {primaryInsurance && <>
            <InsuranceTitle title='patient.summary.primary_insurance_information' />
            <Insurance insurance={primaryInsurance} key={primaryInsurance.insuranceId} />
        </>}

        {secondaryInsurances && secondaryInsurances.length > 0 &&
            <>
                <InsuranceTitle title='patient.summary.secondary_insurance_information' />
                {
                    secondaryInsurances.sort((a,b) => a.sequenceNumber - b.sequenceNumber)?.map((insurance) => {
                        return <Insurance insurance={insurance} key={insurance.insuranceId} />
                    })}
            </>}

        {nonSeqInsurances && nonSeqInsurances.length > 0 &&
        <>
            {
                nonSeqInsurances?.map((insurance) => {
                    return <Insurance insurance={insurance} key={insurance.insuranceId} />
                })}
        </>}
    </div>
};

export default PatientInsurance;
