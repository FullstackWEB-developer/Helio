import {KeyValuePair, RoleBase} from '@shared/models';
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './lookups.initial-state';
import {Provider} from '@shared/models';
import {Location} from '@shared/models';
import {User} from '@shared/models';
import {Option} from '@components/option/option';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';

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
        setProviders(state, {payload}: PayloadAction<Provider[] | undefined>) {
            state.providerList = payload;
            state.isLoading = false;
        },
        setStates(state, {payload}: PayloadAction<Option[] | undefined>) {
            state.states = payload;
        },
        setLocations(state, {payload}: PayloadAction<Location[] | undefined>) {
            state.locationList = payload;
            state.isLoading = false;
        },
        setUserList(state, {payload}: PayloadAction<User[] | undefined>) {
            state.userList = payload;
        },
        setRoleList(state, {payload}: PayloadAction<RoleBase[] | undefined>) {
            state.roleList = payload;
        },

        setForwardToOptions(state, {payload}: PayloadAction<TicketEnumValue[] | undefined>) {
            state.forwardToOptions = payload;
        },
        setMetricOptions(state, {payload}: PayloadAction<KeyValuePair[] | undefined>) {
            state.metricOptions = payload;
            state.isLoading = false;
        }
    }
});

export const {
    setLoading,
    setError,
    setProviders,
    setLocations,
    setUserList,
    setRoleList,
    setMetricOptions,
    setForwardToOptions,
    setStates
} = lookupsSlice.actions

export default lookupsSlice.reducer
