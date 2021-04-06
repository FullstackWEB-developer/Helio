import {KeyValuePair} from '../../models/key-value-pair';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './lookups.initial-state';
import {Provider} from '../../models/provider';
import {Department} from '../../models/department';
import {User} from '../../models/user';
import {Option} from '@components/option/option';

const lookupsSlice = createSlice({
    name: 'lookups',
    initialState,
    reducers: {
        setLoading(state, {payload}: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        setError(state, {payload}: PayloadAction<boolean>) {
            state.isError = payload;
        },
        setProviders(state, { payload }: PayloadAction<Provider[] | undefined>) {
            state.providerList = payload;
            state.isLoading = false;
        },
        setStates(state, { payload }: PayloadAction<Option[] | undefined>) {
            state.states = payload;
        },
        setDepartments(state, { payload }: PayloadAction<Department[] | undefined>) {
            state.departmentList = payload;
            state.isLoading = false;
        },
        setUserList(state, { payload }: PayloadAction<User[] | undefined>) {
            state.userList = payload;
        },
        setMetricOptions(state, { payload }: PayloadAction<KeyValuePair[] | undefined>) {
            state.metricOptions = payload;
            state.isLoading = false;
        }
    }
});

export const {
    setLoading,
    setError,
    setProviders,
    setDepartments,
    setUserList,    
    setMetricOptions,
    setStates
} = lookupsSlice.actions

export default lookupsSlice.reducer
