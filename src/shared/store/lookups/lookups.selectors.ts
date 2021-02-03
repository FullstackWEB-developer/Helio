import { RootState } from '../../../app/store';

export const selectDepartmentList = (state: RootState) => state.lookupsState.departmentList;
export const selectProviderList = (state: RootState) => state.lookupsState.providerList;
