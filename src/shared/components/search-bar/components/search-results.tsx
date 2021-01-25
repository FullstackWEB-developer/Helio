import {Patient} from "../../../../pages/patients/models/patient";
import {useDispatch, useSelector} from "react-redux";
import {selectPatientList} from "../../../../pages/patients/store/patients.selectors";
import ThreeDots from '../../skeleton-loader/skeleton-loader';
import {selectIsSearching, selectIsSearchError} from "../store/search-bar.selectors";
import {addRecentPatient} from '../store/search-bar.slice';
import {useTranslation} from "react-i18next";
import {RecentPatient} from "../models/recent-patient";
import {useHistory} from "react-router-dom";
import patientUtils from "../../../../pages/patients/utils/utils";

const SearchResults = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const patients: Patient[] | undefined = useSelector(selectPatientList);
    const isSearching: boolean = useSelector(selectIsSearching);
    const isError: boolean = useSelector(selectIsSearchError);
    const select = (patient: Patient) => {
        const recentPatient: RecentPatient = {
            patientId: patient.patientId,
            firstName: patient.firstName,
            lastName: patient.lastName,
            age: patientUtils.getAge(patient.dateOfBirth),
            dob: patientUtils.formatDob(patient.dateOfBirth)
        }
        dispatch(addRecentPatient(recentPatient))
        history.push('/patients/' + patient.patientId);
    }
    const heading = (patients !== undefined && patients.length > 0)
        ? t('search.search_results.heading_list')
        : t('search.search_results.heading_empty');

    return (
        <div>
            <div hidden={!isSearching}>
                <ThreeDots />
            </div>
            <div hidden={isError || isSearching} className={"p-4"}>
                <span className={"text-xl font-bold"}>{heading}</span>
                <div className="grid grid-flow-row auto-rows-max md:auto-rows-min">
                    <div hidden={patients === undefined || patients.length === 0}>
                        <div className="grid grid-flow-col auto-cols-max font-bold pt-8">
                                <div className="p-2 w-60">{t('search.search_results.patient_name')}</div>
                                <div className="p-2 w-32">{t('search.search_results.date_of_birth')}</div>
                                <div className="p-2 w-16">{t('search.search_results.action')}</div>
                        </div>
                    </div>
                    <div>
                        {
                            patients?.map(patient =>
                                <div className="grid grid-flow-col auto-cols-max">
                                    <div className="p-2 w-60">{patient.firstName + " " + patient.lastName}</div>
                                    <div className="p-2 w-32">{patientUtils.formatDob(patient.dateOfBirth)}</div>
                                    <div className="p-2 w-16 text-center">
                                        <button onClick={() => select(patient)}>{t('search.search_results.select')}</button>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
            <div hidden={!isError} className={"p-4 text-red-500"}>{t('search.search_results.heading_error')}</div>
        </div>
    );
}

export default SearchResults;