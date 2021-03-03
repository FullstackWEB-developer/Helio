import { Department } from '../../models/department';
import { Provider } from '../../models/provider';
import {User} from '../../models/user';

export interface LookupsState {
    departmentList?: Department[];
    providerList?: Provider[];
    userList?: User[];
    isLoading: boolean;
    isError: boolean;
}

const initialState: LookupsState = {
    departmentList: undefined,
    providerList: undefined,
    isLoading: false,
    isError: false,
    userList: []
}
export default initialState;
