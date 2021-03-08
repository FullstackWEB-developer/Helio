import withErrorLogging from '../../../shared/HOC/with-error-logging';
import Tabs from '../../../shared/components/tab/Tabs';
import Tab from '../../../shared/components/tab/Tab';
import React from 'react';
import { useTranslation } from 'react-i18next';
import PatientNotes from './patient-notes';
import { useSelector } from 'react-redux';
import { selectPatient } from '../store/patients.selectors';

const ActivityPanel = () => {
    const { t } = useTranslation();
    const patient = useSelector(selectPatient);
    return <div className='px-4'>
        <h5 className=' pb-3'>{t('patient.activity')}</h5>
        <Tabs>
            <Tab title={t('patient.notes_tab_label')}>
                <div className='h-120 overflow-y-auto' data-test-id='patient-activity-panel'>
                    <PatientNotes notes={patient?.notes} />
                </div>
            </Tab>
            <Tab title={t('patient.tickets_tab_label')}>Tickets will be here</Tab>
        </Tabs>
    </div>
}

export default withErrorLogging(ActivityPanel);
