import {KeyValuePair} from '../../models/key-value-pair'
import {Department} from '../../models/department';
import {Provider} from '../../models/provider';
import {User} from '../../models/user';

export interface LookupsState {
    departmentList?: Department[];
    providerList?: Provider[];
    userList?: User[];
    isLoading: boolean;
    isError: boolean;    
    metricOptions?: KeyValuePair[];
}

const initialState: LookupsState = {
    departmentList: undefined,
    providerList: undefined,
    isLoading: false,
    isError: false,
    userList: [],   
    metricOptions: []
}
export default initialState;
