import {useSelector} from 'react-redux';
import {selectPatient, selectPatientChartSummary} from '../../store/patients.selectors';
import {useTranslation} from 'react-i18next';
import OldTable from '@components/old-table/old-table';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';

const ContactInformation = () => {
    const {t} = useTranslation();

    const booleanToText = (booleanValue: boolean): string => {
        return booleanValue ? 'common.yes' : 'common.no';
    };

    const formatPhone = (phone: string) => {
        if (phone && phone.length >= 10) {
            return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, phone.length)}`;
        }
        else {
            return phone;
        }
    };

    const patient = useSelector(selectPatient);
    const patientChartSummary = useSelector(selectPatientChartSummary);

    const contactRows = [
        { label: t('patient.summary.address'), values: [patientChartSummary.address] },
        { label: '', values: [patientChartSummary?.city === null ? '' : (`${patientChartSummary?.city}, ${patientChartSummary.state} ${patientChartSummary.zip}`)] },
        { label: t('patient.summary.email'), values: [patientChartSummary.emailAddress] },
        { label: t('patient.summary.portal_access'), values: [t(booleanToText(patientChartSummary.isPortalAccessGiven))] }
    ];

    const contactSecondRows = [
        { label: t('patient.summary.home_phone'), values: [formatPhone(patientChartSummary.homePhone)] },
        { label: t('patient.summary.mobile_phone'), values: [formatPhone(patient.mobilePhone)] },
        { label: t('patient.summary.consent_to_text'), values: [t(booleanToText(patientChartSummary.consentToText))] },
        { label: t('patient.summary.contact_preference'), values: [patientChartSummary.contactPreference] }
    ];

    return (
        <div>
            <div className='border-b pb-1 pt-8'>
                <div className={'font-bold text-lg'}>{t('patient.summary.contact_information')} </div>
            </div>
            <div className='grid grid-cols-2 gap-12'>
                <OldTable headings={[]} rows={contactRows}/>
                <OldTable headings={[]} rows={contactSecondRows}/>
            </div>
        </div>
    );
};

export default withErrorLogging(ContactInformation);
