import React from 'react';
import { useTranslation } from 'react-i18next';
import Tab from '../../../shared/components/tab/Tab';
import Tabs from '../../../shared/components/tab/Tabs';
import PatientSummary from './summary/patient-summary';
import PatientClinical from './clinical/patient-clinical';
import PatientInsurance from './insurance/patient-insurance';
import {PatientChartSummary} from '@pages/patients/models/patient-chart-summary';

export interface PatientTabsProps {
    patientId: number;
    patientChartSummary: PatientChartSummary;
}

const PatientTabs = ({patientId, patientChartSummary} : PatientTabsProps) => {
    const { t } = useTranslation();
    return (
        <div className={'p-8'}>
            <Tabs title={t('patient.tabs.patient_chart')}>
                <Tab title={t('patient.tabs.summary')}>
                    <PatientSummary patientChartSummary={patientChartSummary} />
                </Tab>
                <Tab title={t('patient.tabs.clinical')}>
                    <PatientClinical patientId={patientId} />
                </Tab>
                <Tab title={t('patient.tabs.insurance')}>
                    <PatientInsurance patientId={patientId} />
                </Tab>
            </Tabs>
        </div>
    );
};

export default PatientTabs;
