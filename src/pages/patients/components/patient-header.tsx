import {useTranslation} from "react-i18next";
import {selectPatient} from "../store/patients.selectors";
import {useSelector} from "react-redux";
import utils from "../utils/utils";
import {ExtendedPatient} from "../models/extended-patient";
import React from 'react';

const PatientHeader = () => {
    const { t } = useTranslation();
    const patient: ExtendedPatient = useSelector(selectPatient);
    const SmallLabel = (text: string, value: string) => {
        return(
            <div>
                <span className={"text-gray-400"}>{text}</span>
                <span className={"pl-2"}>{value}</span>
            </div>
        )
    }
    return (
        <div className={"flex flex-row p-8"}>
            <div className={"h-24 w-24 bg-gray-200"}/>
            <div className={"w-96 pl-8 pt-4"}>
                <div className={"text-2xl"}>
                    <span className={"font-bold"}>{`${patient.firstName} ${patient.lastName}`}</span>
                    <span className={"pl-8"}>{t("patient.header.id")}</span>
                    <span className={"font-bold pl-4"}>{patient.patientId}</span>
                </div>
                <div className={"pt-4 flex flex-row space-x-10 text-xl"}>
                    {
                        SmallLabel(t("patient.header.age"), utils.getAge(patient.dateOfBirth).toString())
                    }
                    {
                        SmallLabel(t("patient.header.sex"), patient.sex)
                    }
                    {
                        SmallLabel(t("patient.header.dob"), utils.formatDob(patient.dateOfBirth))
                    }
                    {
                        SmallLabel(t("patient.header.ssn"), patient.ssn)
                    }
                </div>
            </div>
        </div>
    );
}

export default PatientHeader;