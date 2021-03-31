import {KeyValuePair} from '../../models/key-value-pair';
import {RootState} from '../../../app/store';
import {Provider} from '../../models/provider';
import {Department} from '../../models/department';
import {User} from '../../models/user';

export const selectDepartmentList = (state: RootState) => state.lookupsState.departmentList as Department[];
export const selectProviderList = (state: RootState) => state.lookupsState.providerList as Provider[];
export const selectUserList = (state: RootState) => state.lookupsState.userList as User[];
export const selectDepartmentById = (state: RootState, departmentId: string) => {
    const departments = selectDepartmentList(state);
    return departments?.find((d: Department) => d.id.toString() === departmentId);
}
export const selectProviderById = (state: RootState, providerId: string) => {
    const providers = selectProviderList(state);
    return providers?.find((d: Provider) => d.id.toString() === providerId);
}
export const selectIsDepartmentListLoading = (state: RootState) => state.lookupsState.isLoading as boolean;
export const selectMetricOptions = (state: RootState) => state.lookupsState.metricOptions as KeyValuePair[];
