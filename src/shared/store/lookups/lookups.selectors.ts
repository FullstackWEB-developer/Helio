import { RootState } from '../../../app/store';
import {Provider} from "../../models/provider";
import {Department} from "../../models/department";
export const selectDepartmentList = (state: RootState) => state.lookupsState.departmentList as Department[];
export const selectProviderList = (state: RootState) => state.lookupsState.providerList as Provider[];
