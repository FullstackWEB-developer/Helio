import {KeyValuePair} from '@shared/models'
import {Location} from '@shared/models';
import {Provider} from '@shared/models';
import {User} from '@shared/models';
import {Option} from '@components/option/option';

export interface LookupsState {
    locationList?: Location[];
    providerList?: Provider[];
    userList?: User[];
    isLoading: boolean;
    isError: boolean;    
    metricOptions?: KeyValuePair[];
    states?: Option[]
}

const initialState: LookupsState = {
    locationList: undefined,
    providerList: undefined,
    isLoading: false,
    isError: false,
    userList: [],   
    metricOptions: []
}
export default initialState;
