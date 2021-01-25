import PatientHeader from "./components/patient-header";
import {useParams} from "react-router";
import {useEffect} from "react";
import {getPatientById} from "../../shared/components/search-bar/services/search.api";
import {useDispatch, useSelector} from "react-redux";
import ThreeDots from "../../shared/components/skeleton-loader/skeleton-loader";
import {selectPatientLoading, selectPatient, selectIsPatientError} from "./store/patients.selectors";
import {useTranslation} from "react-i18next";

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
