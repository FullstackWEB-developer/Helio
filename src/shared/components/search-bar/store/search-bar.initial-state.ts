import {SearchType} from "../models/search-type";
import {searchTypes} from '../constants/search-type-const';
import {RecentPatient} from "../models/recent-patient";

export interface SearchBarState {
    searchTypeFiltered: SearchType[];
    recentPatients: RecentPatient[];
    searchTerm: string;
    selectedType: number,
    isError: boolean,
    isSearching: boolean
}

const initialState: SearchBarState = {
    searchTypeFiltered: searchTypes,
    recentPatients: [],
    searchTerm: '',
    selectedType: 1,
    isError: false,
    isSearching: false
}
export default initialState;