import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';
import {DefaultPagination, Paging} from '@shared/models/paging.model';
import {UserQueryFilter} from '../models/user-filter-query.model';

export interface UsersState {
    paging: Paging,
    isFilterOpen: boolean;
    statusList: TicketEnumValue[];
    invitationStatusList: TicketEnumValue[];
    departments: string[];
    jobTitles: string[];
    filters: UserQueryFilter | undefined
}

const initialUsersState: UsersState = {
    paging: {...DefaultPagination, pageSize: 10},
    isFilterOpen: false,
    statusList: [],
    invitationStatusList: [],
    departments: [],
    jobTitles: [],
    filters: undefined
}

export default initialUsersState;