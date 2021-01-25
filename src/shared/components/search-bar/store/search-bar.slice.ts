import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './search-bar.initial-state';
import {searchTypes} from '../constants/search-type-const';
import {RecentPatient} from "../models/recent-patient";

const searchBarSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        changeValue(state, action) {
            state.searchTerm = action.payload;
        },
        changeFilteredTypes(state, action){
            state.searchTypeFiltered = action.payload !== ''
                ? searchTypes.filter(type => new RegExp(type.regex).test(action.payload))
                : searchTypes;
            state.selectedType = state.searchTypeFiltered.length > 0
                ? state.searchTypeFiltered
                    .reduce((acc, current) => {return acc.priority < current.priority ? acc : current})
                    .type
                : 1
        },
        setType(state, action){
            state.selectedType = action.payload;
        },
        addRecentPatient(state, {payload}: PayloadAction<RecentPatient>) {
            if(state.recentPatients.findIndex(patient => patient.patientId == payload.patientId) < 0)
                state.recentPatients.push(payload);
        },
        setSearching(state, action) {
            state.isSearching = action.payload;
        },
        setError(state, action) {
            state.isError = action.payload;
        }
    }
});

export const { changeValue, changeFilteredTypes, setType, addRecentPatient, setSearching, setError } = searchBarSlice.actions

export default searchBarSlice.reducer
