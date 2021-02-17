import {useTranslation} from "react-i18next";
import Table from "../../../../shared/components/table/table";
import {useSelector} from "react-redux";
import {
    selectInsuranceLoading,
    selectIsInsuranceError,
    selectPatient,
    selectPrimaryInsurance
} from "../../store/patients.selectors";
import utils from '../../../../shared/utils/utils';
import ThreeDots from "../../../../shared/components/skeleton-loader/skeleton-loader";

const PatientInsurance = () => {
    const {t} = useTranslation();
    const patient = useSelector(selectPatient);
    const primaryInsurance = useSelector(selectPrimaryInsurance);
    const isLoading = useSelector(selectInsuranceLoading);
    const isError = useSelector(selectIsInsuranceError);

    const primaryInsuranceHeader = primaryInsurance !== undefined
        ? `[${primaryInsurance.insurancePackageId}] ${primaryInsurance.insurancePackageAddress1}, ${primaryInsurance.insurancePackageCity}`
            + ` ${primaryInsurance.insurancePackageState}, ${primaryInsurance.insurancePackageZip} ${t('patient.insurance.phone')}: ${primaryInsurance.insurancePhone}`
        : '';

    const policyHolder = (primaryInsurance !== undefined)
        ? (primaryInsurance.insuredLastName && primaryInsurance.insuredFirstName)
            ? primaryInsurance.insuredLastName + ', ' + primaryInsurance.insuredFirstName
            : primaryInsurance.insurancePolicyHolder
        : '';

    const policyInfoRows = primaryInsurance !== undefined
        ? [
        {label: t('patient.insurance.policy_holder'), values: [policyHolder]},
        {label: t('patient.insurance.patients_relation'), values: [primaryInsurance.relationshipToInsured]},
        {label: t('patient.insurance.dob'), values: [utils.formatDate(patient?.dateOfBirth)]},
        {label: t('patient.insurance.group'), values: [primaryInsurance.policyNumber]},
        {label: t('patient.insurance.id_cert'), values: [primaryInsurance.insuranceIdNumber]}
    ]
        : [];

    const eligibilityInfoRows = primaryInsurance !== undefined
        ? [
        {label: t('patient.insurance.status'), values: [primaryInsurance.eligibilityStatus]},
        {label: t('patient.insurance.status_reason'), values: [primaryInsurance.eligibilityReason]},
        {label: t('patient.insurance.pcp'), values: [primaryInsurance.insuredPcp || t('patient.insurance.unknown')]},
        {label: t('patient.insurance.inquiry_date'), values: [primaryInsurance.eligibilityLastChecked]},
        {label: t('patient.insurance.message'), values: [primaryInsurance.eligibilityMessage]},
        {label: t('patient.insurance.plan_description'), values: [primaryInsurance.insurancePlanName || t('patient.insurance.unknown')]}
    ]
        : [];

    return (!isLoading && !isError ?
        <div>
            <div className="grid grid-cols-1 border-b pb-1 pt-8">
                <div  className={"font-bold text-lg"}>{t('patient.summary.primary_insurance_information')}</div>
            </div>
            {
                primaryInsurance !== undefined
                    ? <div>
                        <div className="pt-4"><span
                            className="font-bold">{primaryInsurance?.insurancePlanName}</span> {primaryInsuranceHeader}
                        </div>
                        <div className="grid grid-cols-2 pt-4">
                            <Table headings={[t('patient.insurance.policy_info')]} rows={policyInfoRows} />
                            <Table headings={[t('patient.insurance.eligibility_info')]} rows={eligibilityInfoRows} />
                        </div>
                    </div>
                    : <div>{t('patient.insurance.no_insurance')}</div>
            }
            <div hidden={!isError} className={"p-4 text-red-500"}>{t('patient.insurance.error')}</div>
        </div> : !isError ?
                <>
                    <ThreeDots/>
                </>
                :
                <div className={"p-4 text-red-500"}>{t('patient.summary.error')}</div>
    );
};

export default PatientInsurance;