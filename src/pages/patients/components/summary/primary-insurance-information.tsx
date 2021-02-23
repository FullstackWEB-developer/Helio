import {useSelector} from "react-redux";
import {
    selectPrimaryInsuranceSummary
} from "../../store/patients.selectors";
import {useTranslation} from "react-i18next";

const PrimaryInsuranceInformation = () => {
    const {t} = useTranslation();

    const primaryInsurance = useSelector(selectPrimaryInsuranceSummary);
    const copay = primaryInsurance?.copays?.length > 0 ? `${t('patient.insurance.copay')}: ${primaryInsurance.copays[0].copayType}  ${primaryInsurance.copays[0].copayAmount}` : "";

    const primaryInsuranceHeader = `[${primaryInsurance?.insurancePackageId}] ${primaryInsurance?.insurancePackageAddress1}, ${primaryInsurance?.insurancePackageCity}`
            + ` ${primaryInsurance?.insurancePackageState}, ${primaryInsurance?.insurancePackageZip} ${t('patient.insurance.phone')}: ${primaryInsurance?.insurancePhone}`
            + copay;
    return (<div>
            <div className="grid grid-cols-2 border-b pb-1 pt-8">
                <div className={"font-bold text-lg"}>{t('patient.summary.primary_insurance_information')} </div>
            </div>
        {
            primaryInsurance !== undefined ?
                <div className="pt-4"><span
                    className="font-bold">{primaryInsurance?.InsurancePlanDisplayName}</span> {primaryInsuranceHeader}
                    <span className="font-bold"> {t('patient.insurance.status')}:
                        <span className={primaryInsurance?.eligibilityStatus === 'Eligible' ? "text-primary-400": "text-red-500"}> {primaryInsurance?.eligibilityStatus}</span></span>
                </div>
                : <div>{t('patient.insurance.no_insurance')}</div>
        }
        </div>)
};

export default PrimaryInsuranceInformation;
