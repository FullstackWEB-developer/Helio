import {useSelector} from 'react-redux';
import {selectPatientInsurance, selectPrimaryInsuranceSummary} from '../../store/patients.selectors';
import {useTranslation} from 'react-i18next';

const PrimaryInsuranceInformation = () => {
    const {t} = useTranslation();

    const primaryInsurance = useSelector(selectPrimaryInsuranceSummary);
    const patientInsurance = useSelector(selectPatientInsurance);
    const copay = patientInsurance?.length > 0 ? `${patientInsurance[0].copayAmount}` : '';

    const primaryInsuranceHeader = `[${primaryInsurance?.insurancePackageId}] ${primaryInsurance?.insurancePackageAddress1}, ${primaryInsurance?.insurancePackageCity}`
        + ` ${primaryInsurance?.insurancePackageState}, ${primaryInsurance?.insurancePackageZip}`;
    return (<div>
        <div className='border-b pb-1 pt-8'>
            <div className='body1'>{t('patient.summary.primary_insurance_information')} </div>
        </div>
        {
            primaryInsurance ?
                <div className='pt-4'>
                    <div className='body1'>{primaryInsurance.InsurancePlanDisplayName}</div>
                    {primaryInsuranceHeader}
                    <div className='subtitle2'> {t('patient.insurance.copay')}
                        <span>
                            {copay}
                        </span>
                    </div>
                    <div className='subtitle2'> {t('patient.insurance.status')}
                        <span className={primaryInsurance.eligibilityStatus === t('patient.insurance.eligible') ? 'text-primary-400' : 'text-red-500'}>
                            {primaryInsurance.eligibilityStatus}
                        </span>
                    </div>
                </div>
                : <div>{t('patient.insurance.no_insurance')}</div>
        }
    </div>)
};

export default PrimaryInsuranceInformation;
