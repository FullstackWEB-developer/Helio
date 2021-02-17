import {useSelector} from "react-redux";
import {selectPatientInsurance, selectPrimaryInsurance} from "../../store/patients.selectors";
import {useTranslation} from "react-i18next";

const PrimaryInsuranceInformation = () => {
    const {t} = useTranslation();

    const insurances = useSelector(selectPatientInsurance);
    const primaryInsurance = useSelector(selectPrimaryInsurance);
    const hasInsurance = insurances.length > 0;

    const primaryInsuranceHeader = `[${primaryInsurance?.insurancePackageId}] ${primaryInsurance?.insurancePackageAddress1}, ${primaryInsurance?.insurancePackageCity}`
            + ` ${primaryInsurance?.insurancePackageState}, ${primaryInsurance?.insurancePackageZip} ${t('patient.insurance.phone')}: ${primaryInsurance?.insurancePhone} ${t('patient.insurance.status')}: ${primaryInsurance?.eligibilityStatus}`;
    return (<div>
            <div className="grid grid-cols-2 border-b pb-1 pt-8">
                <div className={"font-bold text-lg"}>{t('patient.summary.primary_insurance_information')} </div>
            </div>
        {
            hasInsurance ?
                <div className="pt-4"><span
                    className="font-bold">{primaryInsurance?.insurancePlanName}</span> {primaryInsuranceHeader}
                </div>
                : <div>{t('patient.insurance.no_insurance')}</div>
        }
        </div>)
};

export default PrimaryInsuranceInformation;
