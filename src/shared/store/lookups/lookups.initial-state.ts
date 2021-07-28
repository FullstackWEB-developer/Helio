import {KeyValuePair} from '@shared/models'
import {Location} from '@shared/models';
import {Provider} from '@shared/models';
import {User} from '@shared/models';
import {Option} from '@components/option/option';
import {RoleBase} from '@shared/models/role-base.model';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';

export interface LookupsState {
    locationList?: Location[];
    providerList?: Provider[];
    userList?: User[];
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
    isLoading: false,
    isError: false,
    userList: [],
    metricOptions: [],
    forwardToOptions: []
}
export default initialState;
