import {useTranslation} from "react-i18next";
import {selectPatient} from "../store/patients.selectors";
import {useSelector} from "react-redux";
import {Patient} from "../models/patient";
import utils from "../utils/utils";

const PatientHeader = () => {
    const { t } = useTranslation();
    const patient: Patient = useSelector(selectPatient);
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
            <div className={"h-24 w-24 bg-gray-200"}></div>
            <div className={"w-96 pl-8 pt-4"}>
                <div>
                    <span className={"text-xl font-bold"}>{`${patient.firstName} ${patient.lastName}`}</span>
                    <span className={"text-xl pl-8"}>{t("patient.header.id")}</span>
                    <span className={"text-xl font-bold pl-4"}>{patient.patientId}</span>
                </div>
                <div className={"pt-4 flex flex-row space-x-10"}>
                    {
                        SmallLabel(t("patient.header.age"), utils.getAge(patient.dateOfBirth).toString())
                    }
                    {
                        SmallLabel(t("patient.header.sex"), "X")
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