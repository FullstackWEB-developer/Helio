import withErrorLogging from '../../../shared/HOC/with-error-logging';
import Tabs from '@components/tab/Tabs';
import Tab from '@components/tab/Tab';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import PatientNotes from './patient-notes';
import PatientTickets from './patient-tickets';
import {useSelector} from 'react-redux';
import {selectPatient, selectPatientLoading} from '../store/patients.selectors';
import PatientAddNote from '@pages/patients/components/patient-add-note';
import './activity-panel.scss';
import Spinner from '@components/spinner/Spinner';

const ActivityPanel = () => {
    const {t} = useTranslation();
    const patient = useSelector(selectPatient);
    const [selectedTab, setSelectedTab] = useState<number>(0);
    const isLoading = useSelector(selectPatientLoading);

    if (isLoading) {
        return <Spinner fullScreen />
    }

    return <div className='flex flex-col h-full overflow-hidden pt-12'>
        <div className='px-8 flex-grow'>
            <h5 className='pb-3'>{t('patient.activity.title')}</h5>
            <Tabs onSelect={(index) => setSelectedTab(index)}>
                <Tab title={t('patient.notes_tab_label')}>
                    <div data-test-id='patient-activity-panel'>
                        <PatientNotes notes={patient?.notes} />
                    </div>
                </Tab>
                <Tab title={t('patient.tickets_tab_label')}>
                    <PatientTickets patientId={patient?.patientId} />
                </Tab>
            </Tabs>
        </div>
        {selectedTab === 0 && <div className='flex justify-end flex-col'>
            <PatientAddNote />
        </div>}
    </div>
}

export default withErrorLogging(ActivityPanel);
