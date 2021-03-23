import { RootState } from '../../../../app/store';
import {RecentPatient} from '../models/recent-patient';

export const selectRecentPatients = (state: RootState) => state.searchState.recentPatients as RecentPatient[];
export const selectSearchTypeFiltered = (state: RootState) => state.searchState.searchTypeFiltered;
export const selectSelectedType = (state: RootState) => state.searchState.selectedType;
export const selectIsSearching = (state: RootState) => state.searchState.isSearching;
export const selectIsSearchError = (state: RootState) => state.searchState.isError;
