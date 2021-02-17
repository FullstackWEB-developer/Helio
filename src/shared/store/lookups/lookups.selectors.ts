import { RootState } from '../../../app/store';
import {Provider} from "../../models/provider";
import {Department} from "../../models/department";
export const selectDepartmentList = (state: RootState) => state.lookupsState.departmentList as Department[];
export const selectProviderList = (state: RootState) => state.lookupsState.providerList as Provider[];
export const selectDepartmentById = (state: RootState, departmentId: string) => {
    const departments = selectDepartmentList(state);
    return departments?.find((d: Department) => d.id.toString() === departmentId);
}
export const selectProviderById = (state: RootState, providerId: string) => {
    const providers = selectProviderList(state);
    return providers?.find((d: Provider) => d.id.toString() === providerId);
}
