import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './search-bar.initial-state';
import { searchTypes } from '../constants/search-type-const';
import { RecentPatient } from '../models/recent-patient';

const searchBarSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {
        changeFilteredTypes(state, action) {
            state.searchTypeFiltered = action.payload !== ''
                ? searchTypes.filter(type => new RegExp(type.regex).test(action.payload))
                : [];

            state.selectedType = state.searchTypeFiltered.length > 0
                ? state.searchTypeFiltered
                    .reduce((acc, current) => { return acc.priority < current.priority ? acc : current })
                    .type
                : 1
        },
        setType(state, action) {
            state.selectedType = action.payload;
        },
        changeTypeUp(state) {
            const findTypeIndex = state.searchTypeFiltered.findIndex(type => type.type === state.selectedType);
            const newType = findTypeIndex === 0
                ? state.searchTypeFiltered[state.searchTypeFiltered.length - 1]
                : state.searchTypeFiltered[findTypeIndex - 1];
            state.selectedType = newType.type;
        },
        changeTypeDown(state) {
            const findTypeIndex = state.searchTypeFiltered.findIndex(type => type.type === state.selectedType);
            const newType = findTypeIndex < state.searchTypeFiltered.length - 1
                ? state.searchTypeFiltered[findTypeIndex + 1]
                : state.searchTypeFiltered[0];
            state.selectedType = newType.type;
        },
        addRecentPatient(state, { payload }: PayloadAction<RecentPatient>) {
            const findPatientIndex = state.recentPatients.findIndex(patient => patient.patientId === payload.patientId);

            if (findPatientIndex >= 0) {
                state.recentPatients.splice(findPatientIndex, 1);
            }

            state.recentPatients.splice(0, 0, payload);
            state.recentPatients = state.recentPatients.slice(0, 5);
        },
        clearRecentPatients(state) {
            state.recentPatients = [];
        },
        setError(state, action) {
            state.isError = action.payload;
        }
    }
});

export const {changeFilteredTypes, setType, changeTypeDown, changeTypeUp, addRecentPatient, clearRecentPatients, setError } = searchBarSlice.actions

export default searchBarSlice.reducer
