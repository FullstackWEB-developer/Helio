import {KeyValuePair, RoleBase} from '@shared/models'
import {Location} from '@shared/models';
import {Provider} from '@shared/models';
import {User} from '@shared/models';
import {Option} from '@components/option/option';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';

export interface LookupsState {
    locationList?: Location[];
    providerList?: Provider[];
    userList?: User[];
    allProviderList?: Provider[];
    roleList?: RoleBase[];
    isLoading: boolean;
    isError: boolean;
    metricOptions?: KeyValuePair[];
    states?: Option[],
    forwardToOptions?: TicketEnumValue[];
}

const initialState: LookupsState = {
    locationList: undefined,
    providerList: undefined,
    allProviderList: undefined,
    isLoading: false,
    isError: false,
    userList: [],
    metricOptions: [],
    roleList:[],
    forwardToOptions: []
}
export default initialState;
