import {useSelector} from 'react-redux';
import {selectPatient} from '../../store/patients.selectors';
import {useTranslation} from 'react-i18next';
import PatientChartList from '@pages/patients/components/patient-chart-list';
import React, {useState} from 'react';
import ContactInformationUpdate from '@pages/patients/components/summary/patient-contact-info-update';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';
import withErrorLogging from '@shared/HOC/with-error-logging';
import SvgIcon from '@components/svg-icon/svg-icon';
import {Icon} from '@components/svg-icon/icon';

export interface ContactInformationProps {
    patientChartSummary: PatientChartSummary;
}

const ContactInformation = ({patientChartSummary} : ContactInformationProps) => {
    const {t} = useTranslation();
    const [editMode, setEditMode] = useState<boolean>(false);

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

    const contactRows = [
        { label: t('patient.summary.address'), values: [patient.address] },
        { label: '', values: [patient.address2] },
        { label: '', values: [`${patient?.city || ''}${patient?.state ? ', ': ''} ${patient.state || ''} ${patient.zip || ''}`] },
        { label: t('patient.summary.email'), values: [patient.emailAddress] },
        { label: t('patient.summary.portal_access'), values: [t(booleanToText(patient.isPortalAccessGiven))] }
    ];

    const contactSecondRows = [
        { label: t('patient.summary.home_phone'), values: [formatPhone(patient.homePhone)] },
        { label: t('patient.summary.mobile_phone'), values: [formatPhone(patient.mobilePhone)] },
        {
            label: t('patient.summary.contact_preference'),
            values: [patient.contactPreference ? t(`patient.contact_preference.${patient.contactPreference.toLowerCase()}`) : t('common.not_available')]
        },
        { label: t('patient.summary.consent_to_text'), values: [t(booleanToText(patient.consentToText))] }
    ];

    return (
        <div>
            <div className='pb-1 pt-8 flex justify-between'>
                <div className={'body1'}>{t('patient.summary.contact_information')} </div>
                <SvgIcon type={Icon.Edit} onClick={() => setEditMode(!editMode)}
                         className='medium cursor-pointer mr-4'
                         fillClass='edit-icon'/>
            </div>
            {editMode ? <ContactInformationUpdate
                patientChartSummary={patientChartSummary}
                onUpdateComplete={() => setEditMode(false)}/> : <div className='border-t grid grid-cols-2 gap-12'>
                <PatientChartList headings={[]} rows={contactRows}/>
                <PatientChartList headings={[]} rows={contactSecondRows}/>
            </div>
            }
        </div>
    );
};

export default withErrorLogging(ContactInformation);
