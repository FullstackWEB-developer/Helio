import {SearchType} from '../models/search-type';
import {RecentPatient} from '../models/recent-patient';

export interface SearchBarState {
    searchTypeFiltered: SearchType[];
    recentPatients: RecentPatient[];
    selectedType: number,
    isError: boolean,
    searchTerm: string;
    searchTermDisplayValue: string;
}

const initialState: SearchBarState = {
    searchTypeFiltered: [],
    recentPatients: [],
    selectedType: 1,
    isError: false,
    searchTerm: '',
    searchTermDisplayValue: ''
}
export default initialState;
