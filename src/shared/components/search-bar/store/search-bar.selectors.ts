import {RootState} from '../../../../app/store';
import {RecentPatient} from '../models/recent-patient';

export const selectRecentPatients = (state: RootState) => state.searchState.recentPatients as RecentPatient[];
export const selectSearchTypeFiltered = (state: RootState) => state.searchState.searchTypeFiltered;
export const selectSelectedType = (state: RootState) => state.searchState.selectedType;
export const selectSearchTerm = (state: RootState) => state.searchState.searchTerm;
export const selectSearchTermDisplayValue = (state: RootState) => state.searchState.searchTermDisplayValue;