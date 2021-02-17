import Appointments from "./appointments";
import RecentPatientCases from "./recent-patient-cases";
import {useSelector} from "react-redux";
import {selectClinicalLoading, selectIsClinicalError} from "../../store/patients.selectors";
import {useTranslation} from "react-i18next";
import ThreeDots from "../../../../shared/components/skeleton-loader/skeleton-loader";

const PatientClinical = () => {
    const {t} = useTranslation();
    const isLoading = useSelector(selectClinicalLoading);
    const isError = useSelector(selectIsClinicalError);
    return (!isLoading && !isError ?
        <>
            <Appointments/>
            <RecentPatientCases/>
        </> : !isError ?
                <>
                    <ThreeDots/>
                </>
                :
                <div className={"p-4 text-red-500"}>{t('patient.clinical.error')}</div>
    );
};

export default PatientClinical;
