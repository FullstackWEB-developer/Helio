import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './lookups.initial-state';
import { Provider } from '../../models/provider';
import { Department } from '../../models/department';
import {User} from '../../models/user';

const lookupsSlice = createSlice({
    name: 'lookups',
    initialState,
    reducers: {
        setLoading(state, { payload }: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        setError(state, { payload }: PayloadAction<boolean>) {
            state.isError = payload;
        },
        setProviders(state, { payload }: PayloadAction<Provider[] | undefined>) {
            state.providerList = payload;
            state.isLoading = false;
        },
        setDepartments(state, { payload }: PayloadAction<Department[] | undefined>) {
            state.departmentList = payload;
            state.isLoading = false;
        },
        setUserList(state, { payload }: PayloadAction<User[] | undefined>) {
            state.userList = payload;
        }
    }
});

export const {
    setLoading,
    setError,
    setProviders,
    setDepartments,
    setUserList
} = lookupsSlice.actions

export default lookupsSlice.reducer
