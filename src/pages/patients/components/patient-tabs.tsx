import React from "react";
import {useTranslation} from "react-i18next";
import Tab from "../../../shared/components/tab/Tab";
import Tabs from "../../../shared/components/tab/Tabs";
import PatientSummary from "./summary/patient-summary";
import PatientClinical from "./clinical/patient-clinical";
import PatientInsurance from "./insurance/patient-insurance";

const PatientTabs = () => {
    const {t} = useTranslation();
    return (
        <div className={"p-8"}>
            <Tabs title={t('patient.tabs.patient_chart')}>
                <Tab title={t('patient.tabs.summary')}>
                    <PatientSummary />
                </Tab>
                <Tab title={t('patient.tabs.clinical')}>
                    <PatientClinical />
                </Tab>
                <Tab title={t('patient.tabs.insurance')}>
                    <PatientInsurance />
                </Tab>
            </Tabs>
        </div>
    );
};

export default PatientTabs;