import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './lookups.initial-state';
import {Provider} from "../../models/provider";
import {Department} from "../../models/department";

const lookupsSlice = createSlice({
    name: 'patients',
    initialState,
    reducers: {
        setLoading(state, {payload}: PayloadAction<boolean>){
            state.isLoading = payload;
        },
        setError(state, {payload}: PayloadAction<boolean>){
            state.isError = payload;
        },
        setProviders(state, {payload}: PayloadAction<Provider[]>) {
            state.providerList = payload;
            state.isLoading = false;
        },
        clearProviders(state) {
            state.providerList = undefined;
        },
        setDepartments(state, {payload}: PayloadAction<Department[]>) {
            state.departmentList = payload;
            state.isLoading = false;
        },
        clearDepartments(state) {
            state.departmentList = undefined;
        },
    }
});

export const {
    setLoading,
    setError,
    setProviders,
    clearProviders,
    setDepartments,
    clearDepartments
} = lookupsSlice.actions

export default lookupsSlice.reducer
