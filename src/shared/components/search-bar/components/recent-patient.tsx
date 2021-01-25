import React from "react";
import {RecentPatient} from "../models/recent-patient";
import {useTranslation} from "react-i18next";
interface RecentPatientProps {
    patient: RecentPatient,
    onClick: (patient: RecentPatient) => any
}
const RecentPatientDetails = ({patient, onClick}: RecentPatientProps) => {
    const { t } = useTranslation();
    return(
        <div className={"px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer"} key={patient.patientId}>
                                <span onClick={() => onClick(patient)}>
                                    <p>{`${patient.lastName}, ${patient.firstName}`}</p>
                                    <p>{`${patient.age} ${t("search.yearsOld")} X | ${patient.dob} | #${patient.patientId}`}</p>
                                </span>
        </div>
    )
}

export default RecentPatientDetails;