import {useTranslation} from 'react-i18next';
import patientUtils from '@pages/patients/utils/utils';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';
import {useMemo} from 'react';
import {SelfPayInsuranceTypeName} from '@pages/patients/patient-constants';

export interface PrimaryInsuranceInformationProps {
    patientChartSummary: PatientChartSummary;
}
const PrimaryInsuranceInformation = ({patientChartSummary} : PrimaryInsuranceInformationProps) => {
    const {t} = useTranslation();

    const primaryInsurance = patientChartSummary.primaryInsurance;
    const primaryInsuranceHeader = primaryInsurance ? `${patientUtils.getInsuranceHeader(primaryInsurance, t('common.not_available'))} ` : '';

    const getEligibleTextColor = () => {
        return primaryInsurance?.eligibilityStatus === t('patient.insurance.eligible') ? 'text-primary-400' : 'text-red-500';
    }

    let copayAmount = useMemo(() =>  primaryInsurance?.copays && primaryInsurance.copays.length > 0 && primaryInsurance.copays[0]?.copayAmount, [primaryInsurance?.copays]);

    return (<div>
        <div className='border-b pb-2 pt-3.5'>
            <div className='body1'>{t('patient.summary.primary_insurance_information')} </div>
        </div>
        {
            primaryInsurance ? <div className='pt-3.5'>
                    <div className='body1'>{primaryInsurance.insuranceType === SelfPayInsuranceTypeName ? primaryInsurance.insurancePlanName : primaryInsurance.insurancePlanDisplayName}</div>
                    {primaryInsuranceHeader}
                    <div className='subtitle2'> {t('patient.summary.copay')}
                        <span>
                            {copayAmount ?? 0}
                        </span>
                    </div>
                    <div className='subtitle2'> {t('patient.summary.status')}
                        <span className={getEligibleTextColor()}>
                            {primaryInsurance.eligibilityStatus}
                        </span>
                    </div>
                </div> : <div>{t('patient.insurance.no_insurance')}</div>
        }
    </div>)
};

export default PrimaryInsuranceInformation;
