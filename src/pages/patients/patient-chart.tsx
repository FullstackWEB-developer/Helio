import PatientHeader from "./components/patient-header";
import {useParams} from "react-router";
import {useEffect} from "react";
import {getPatientById} from "../../shared/services/search.service";
import {useDispatch, useSelector} from "react-redux";
import ThreeDots from "../../shared/components/skeleton-loader/skeleton-loader";
import {selectPatientLoading, selectPatient, selectIsPatientError} from "./store/patients.selectors";
import {useTranslation} from "react-i18next";
import {RecentPatient} from "../../shared/components/search-bar/models/recent-patient";
import patientUtils from "./utils/utils";
import {addRecentPatient} from "../../shared/components/search-bar/store/search-bar.slice";

interface PatientParams {
    patientId: string
}

const PatientChart = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {patientId} = useParams<PatientParams>();
    const loading = useSelector(selectPatientLoading);
    const error = useSelector(selectIsPatientError);
    const patient = useSelector(selectPatient);

    useEffect(() => {
        dispatch(getPatientById(patientId));
    }, [dispatch, patientId]);

    useEffect(() => {
        if(patient) {
            const recentPatient: RecentPatient = {
                patientId: patient.patientId,
                firstName: patient.firstName,
                lastName: patient.lastName,
                age: patientUtils.getAge(patient.dateOfBirth),
                dob: patientUtils.formatDob(patient.dateOfBirth)
            }
            dispatch(addRecentPatient(recentPatient))
        }
    }, [dispatch, patient]);

    return (
        <div>
            <div hidden={!loading}>
                <ThreeDots />
            </div>
            {
                !loading && !error && patient !== undefined
                    ? <PatientHeader />
                    : <div hidden={loading || error} className={"p-4"}>
                            <span className={"text-xl font-bold"}>{t('patient.not_found')}</span>
                        </div>
            }
            <div hidden={!error} className={"p-4 text-red-500"}>{t('search.search_results.heading_error')}</div>
        </div>
    );
}

export default PatientChart;
