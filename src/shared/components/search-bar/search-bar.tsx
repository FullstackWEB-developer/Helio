import React, {useState} from "react";
import {SearchType} from "./models/search-type";
import { ReactComponent as SearchIcon } from '../../icons/Icon-Search-16px.svg';
import Text from "../text/text";
import {
    selectRecentPatients,
    selectSearchTypeFiltered,
    selectSelectedType,
    selectTerm
} from "./store/search-bar.selectors";
import { changeValue, changeFilteredTypes } from './store/search-bar.slice';
import { searchPatients } from './services/search.api';
import {useDispatch, useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {useHistory} from "react-router-dom";
import {RecentPatient} from "./models/recent-patient";
import RecentPatientDetails from "./components/recent-patient";
import SearchTypeItem from "./components/search-type-item";
import {searchType} from "./constants/search-type";

const SearchBar = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const history = useHistory();
    const [hideDropdown, setDropdown] = useState(true);
    const recentPatients = useSelector(selectRecentPatients);
    const selectedType = useSelector(selectSelectedType);
    const searchTypeFiltered = useSelector(selectSearchTypeFiltered);
    const searchTerm = useSelector(selectTerm);

    const textChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const text = e.target.value;
        dispatch(changeValue(text));
        dispatch(changeFilteredTypes(text))
    }
    const search = (type?: number) => {
        if(type === searchType.patientId) {
            history.push('/patients/' + searchTerm);
        }
        else {
            dispatch(searchPatients(type || selectedType, searchTerm));
            history.push('/patients/results');
        }
    }
    const onblur = () => {
        setTimeout(() => setDropdown(true), 100)
    }
    const selectRecent = (recentPatient: RecentPatient) => {
        history.push('/patients/' + recentPatient.patientId);
    }

    return (
        <div className={"relative"}>
            <div className={"border rounded-r px-4 py-2 w-80"}>
                <input type="text" className={"focus:outline-none w-full"} placeholder={t("search.placeholder")}
                       onFocus={() => setDropdown(false)} onBlur={() => onblur()}
                        onChange={(e) => textChange(e)}/>
                <span className={"absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer"}>
                    <SearchIcon onClick={() => search()} />
                </span>
            </div>
            <div hidden={hideDropdown} className={"absolute flex-col divide-y shadow-md w-80 bg-white"}>
                <div className={"pb-2"}>
                    <p className={"px-4 pt-4 pb-2"}>
                        <Text text={t("search.search_title")} className={"font-bold"}/>
                    </p>
                    {
                        searchTypeFiltered.map((typeItem: SearchType) =>
                            <SearchTypeItem key={typeItem.type} searchType={typeItem} onClick={() => search(typeItem.type)}/>)
                    }
                </div>
                <div className={"pb-2"} hidden={recentPatients.length === 0}>
                    <p className={"px-4 pt-4 pb-2"}>
                        <Text text={t("search.recent_patients")} className={"font-bold"}/>
                    </p>
                    {
                        recentPatients.map((rPatient: RecentPatient) =>
                            <RecentPatientDetails key={rPatient.patientId} patient={rPatient} onClick={() => selectRecent(rPatient)}/>)
                    }
                </div>
            </div>
        </div>
    );
}

export default SearchBar;
