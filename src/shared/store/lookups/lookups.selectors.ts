import {
    ConnectUser,
    KeyValuePair,
    Provider,
    Location,
    User
} from '@shared/models';
import {RootState} from '../../../app/store';
import {Option} from '@components/option/option';
import {RoleBase} from '@shared/models/role-base.model';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';

export const selectLocationList = (state: RootState) => state.lookupsState.locationList as Location[];
export const selectProviderList = (state: RootState) => state.lookupsState.providerList as Provider[];
export const selectUserList = (state: RootState): User[] => state.lookupsState.userList ? state.lookupsState.userList : [];
export const selectRoleList = (state: RootState) => state.lookupsState.roleList as RoleBase[];
export const selectConnectUserList = (state: RootState) => state.lookupsState.connectUserList as ConnectUser[]
export const selectUserOptions = (state: RootState): Option[] => {
    return state.lookupsState.userList ? state.lookupsState.userList.map((item: User) => {
        return {
            value: item.id,
            label: `${item.firstName} ${item.lastName}`
        };
    }) : [];
}

export const selectUserByEmail = (state: RootState, email?: string): User | undefined => {
    if (!!email) {
        return state.lookupsState.userList?.find((user: User) => user.email === email)
    }
}


export const selectLocationsAsOptions = (state: RootState): Option[] => {
    return state.lookupsState.locationList ? state.lookupsState.locationList.map((item: Location) => {
        return {
            value: item.id.toString(),
            label: item.name
        };
    }) : [];
}
export const selectStates = (state: RootState) => state.lookupsState.states as Option[];
export const selectDepartmentById = (state: RootState, departmentId: number) => {
    const departments = selectLocationList(state);
    return departments?.find((d: Location) => d.id === departmentId);
}
export const selectProviderById = (state: RootState, providerId: number) => {
    const providers = selectProviderList(state);
    return providers?.find((d: Provider) => d.id === providerId);
}
export const selectIsDepartmentListLoading = (state: RootState) => state.lookupsState.isLoading as boolean;
export const selectMetricOptions = (state: RootState) => state.lookupsState.metricOptions as KeyValuePair[];
export const selectForwardToOptions = (state: RootState) => state.lookupsState.forwardToOptions as TicketEnumValue[];
