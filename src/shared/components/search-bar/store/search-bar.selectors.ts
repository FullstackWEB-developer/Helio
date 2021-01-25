import { RootState } from "../../../../app/store";

export const selectRecentPatients = (state: RootState) => state.searchState.recentPatients;
export const selectSearchTypeFiltered = (state: RootState) => state.searchState.searchTypeFiltered;
export const selectSelectedType = (state: RootState) => state.searchState.selectedType;
export const selectTerm = (state: RootState) => state.searchState.searchTerm;
export const selectIsSearching = (state: RootState) => state.searchState.isSearching;
export const selectIsSearchError = (state: RootState) => state.searchState.isError;