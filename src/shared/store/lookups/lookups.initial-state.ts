import {KeyValuePair} from '../../models/key-value-pair'
import {Department} from '../../models/department';
import {Provider} from '../../models/provider';
import {User} from '../../models/user';
import {Option} from '@components/option/option';

export interface LookupsState {
    departmentList?: Department[];
    providerList?: Provider[];
    userList?: User[];
    isLoading: boolean;
    isError: boolean;    
    metricOptions?: KeyValuePair[];
    states?: Option[]
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
