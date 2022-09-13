import React, {useCallback, useEffect, useState, ReactElement} from 'react';
import {useTranslation} from 'react-i18next';
import Tab from '../../../shared/components/tab/Tab';
import Tabs from '../../../shared/components/tab/Tabs';
import PatientSummary from './summary/patient-summary';
import PatientInsurance from './insurance/patient-insurance';
import Appointments from './clinical/appointments';
import RecentPatientCases from './clinical/recent-patient-cases';
import ClinicalMedications from './clinical/clinical-medications';
import ClinicalLabResults from './clinical/clinical-lab-results';
import {PatientTab} from '../enums/patient-tab.enum';
import {useHistory, useLocation} from 'react-router';
import {useQuery} from 'react-query';
import {GetPatientChartTabSettings} from '@constants/react-query-constants';
import {getPatientChartTabSettings} from '@shared/services/lookups.service';
import Spinner from '@components/spinner/Spinner';

const PatientTabs = () => {
    const {t} = useTranslation();
    const history = useHistory();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(0);

    const {data: patientTabConfiguration, isFetching} = useQuery([GetPatientChartTabSettings], () => getPatientChartTabSettings());

    useEffect(() => {
        if (isFetching) {return };
        const queryParams = new URLSearchParams(location.search);
        const tab = queryParams.get('tab') ?? String(activeTab);
        const newTabValue = tab && Number(tab) >= 0 && Number(tab) in PatientTab
            && isValidTabValuePerVisibilityConfiguration(Number(tab)) ? Number(tab) : 0;
        setActiveTab(newTabValue);
        history.replace({
            pathname: location.pathname,
            search: String(new URLSearchParams({'tab': String(newTabValue)}))
        });
    }, [patientTabConfiguration, isFetching]);

    const onTabChange = (selectedTabIndex: number) => {
        setActiveTab(selectedTabIndex);
        history.replace({
            pathname: location.pathname,
            search: String(new URLSearchParams({'tab': String(selectedTabIndex)}))
        });
    }

    const isValidTabValuePerVisibilityConfiguration = (tab: number) => {
        if (!(tab in PatientTab)) {
            return false;
        }
        switch (tab) {
            case PatientTab.Summary:
                return true;
            case PatientTab.Appointments:
                return patientTabConfiguration?.isAppointmentsVisible;
            case PatientTab.PatientCases:
                return patientTabConfiguration?.isPatientCasesVisible;
            case PatientTab.Insurance:
                return patientTabConfiguration?.isInsuranceVisible;
            case PatientTab.Medications:
                return patientTabConfiguration?.isMedicationsVisible;
            case PatientTab.LabResults:
                return patientTabConfiguration?.isTestResultsVisible;
            default:
                return false;
        }
    }

    const renderTabs = useCallback(() => {
        let tabs: ReactElement[] = [
            <Tab key={'patient.tabs.summary'} title={t('patient.tabs.summary')}>
                <PatientSummary />
            </Tab>
        ];
        if (patientTabConfiguration?.isAppointmentsVisible) {
            tabs.push(<Tab key={'patient.tabs.appointments'} title={t('patient.tabs.appointments')}>
                <Appointments />
            </Tab>)
        }
        if (patientTabConfiguration?.isPatientCasesVisible) {
            tabs.push(<Tab key={'patient.tabs.patient_cases'} title={t('patient.tabs.patient_cases')}>
                <RecentPatientCases />
            </Tab>)
        }
        if (patientTabConfiguration?.isInsuranceVisible) {
            tabs.push(<Tab key={'patient.tabs.insurance'} title={t('patient.tabs.insurance')}>
                <PatientInsurance />
            </Tab>);
        }
        if (patientTabConfiguration?.isMedicationsVisible) {
            tabs.push(<Tab key={'patient.tabs.medications'} title={t('patient.tabs.medications')}>
                <ClinicalMedications />
            </Tab>);
        }
        if (patientTabConfiguration?.isTestResultsVisible) {
            tabs.push(<Tab key={'patient.tabs.lab_results'} title={t('patient.tabs.lab_results')}>
                <ClinicalLabResults />
            </Tab>);
        }
        return tabs;
    }, [patientTabConfiguration]);

    return (
        <div className={'p-8'}>
            {
                isFetching ? <Spinner /> :
                    (patientTabConfiguration &&
                        <Tabs title={t('patient.tabs.patient_chart')} onSelect={onTabChange}
                            activeTabIndex={activeTab} titleClass='pr-2'>
                            {
                                renderTabs()
                            }
                        </Tabs>
                    )
            }
        </div>
    );
};

export default PatientTabs;
