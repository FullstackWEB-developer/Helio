import {useSelector} from "react-redux";
import { selectPatient, selectPatientChartSummary} from "../../store/patients.selectors";
import {useTranslation} from "react-i18next";
import {ReactComponent as EditIcon} from '../../../../shared/icons/Icon-Edit-24px.svg';
import Table from "../../../../shared/components/table/table";

const ContactInformation = () => {
    const {t} = useTranslation();

    const booleanToText = (booleanValue: boolean): string => {
        return booleanValue ? 'common.yes' : 'common.no';
    };

    const patient = useSelector(selectPatient);
    const patientChartSummary = useSelector(selectPatientChartSummary);

    const contactRows = [
        {label: t('patient.summary.address'), values: [patientChartSummary.address]},
        {label: '', values: [patientChartSummary?.city + ', ' + patientChartSummary.state + ' ' + patientChartSummary.zip]},
        {label: t('patient.summary.email'), values: [patientChartSummary.emailAddress]},
        {label: t('patient.summary.portal_access'), values: [t(booleanToText(patientChartSummary.isPortalAccessGiven))]}
    ];

    const contactSecondRows = [
        {label: t('patient.summary.home_phone'), values: [patientChartSummary.homePhone]},
        {label: t('patient.summary.mobile_phone'), values: [patient.mobilePhone]},
        {label: t('patient.summary.consent_to_text'), values: [t(booleanToText(patientChartSummary.consentToText))]},
        {label: t('patient.summary.contact_preference'), values: [patientChartSummary.contactPreference]}
    ];

    return (
        <div>
            <div className="grid grid-cols-2 border-b pb-1 pt-8">
                <div className={"font-bold text-lg"}>{t('patient.summary.contact_information')} </div>
                <div className="justify-self-end pr-3"><EditIcon/></div>
            </div>
            <div className="grid grid-cols-2 gap-12">
                <Table headings={[]} rows={contactRows}/>
                <Table headings={[]} rows={contactSecondRows}/>
            </div>
        </div>
    );
};

export default ContactInformation;
