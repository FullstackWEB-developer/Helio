import {KeyValuePair} from '../../models/key-value-pair';
import {RootState} from '../../../app/store';
import {Provider} from '../../models/provider';
import {Department} from '../../models/department';
import {User} from '../../models/user';
import {Option} from '@components/option/option';

export const selectDepartmentList = (state: RootState) => state.lookupsState.departmentList as Department[];

export const selectProviderList = (state: RootState) => state.lookupsState.providerList as Provider[];
export const selectUserList = (state: RootState): User[] => state.lookupsState.userList ? state.lookupsState.userList : [];

export const selectUserOptions = (state: RootState): Option[] => {
    return state.lookupsState.userList ? state.lookupsState.userList.map((item: User) => {
        return {
            value: item.id,
            label: `${item.firstName} ${item.lastName}`
        };
    }) : [];
}

export const selectDepartmentListAsOptions = (state: RootState): Option[] => {
    return state.lookupsState.departmentList ? state.lookupsState.departmentList.map((item: Department) => {
        return {
            value: item.id.toString(),
            label: item.name
        };
    }) : [];
}
export const selectStates = (state: RootState) => state.lookupsState.states as Option[];
export const selectDepartmentById = (state: RootState, departmentId: number) => {
    const departments = selectDepartmentList(state);
    return departments?.find((d: Department) => d.id === departmentId);
}
export const selectProviderById = (state: RootState, providerId: number) => {
    const providers = selectProviderList(state);
    return providers?.find((d: Provider) => d.id === providerId);
}
export const selectIsDepartmentListLoading = (state: RootState) => state.lookupsState.isLoading as boolean;
export const selectMetricOptions = (state: RootState) => state.lookupsState.metricOptions as KeyValuePair[];
