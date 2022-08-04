import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';
import {SelectExternalUser} from '@shared/models';
import {DefaultPagination, Paging} from '@shared/models/paging.model';
import {UserQueryFilter} from '../models/user-filter-query.model';

export interface UsersState {
    paging: Paging,
    isFilterOpen: boolean;
    statusList: TicketEnumValue[];
    invitationStatusList: TicketEnumValue[];
    departments: string[];
    jobTitles: string[];
    filters: UserQueryFilter | undefined,
    bulkPaging: Paging;
    isBulkFilterOpen: boolean;
    bulkFilters: UserQueryFilter | undefined,
    externalDepartments: string[];
    externalJobTitles: string[];
    selectedExternalUsers: SelectExternalUser[];
    selectedUsersLocalPagination: Paging;
    bulkLocalFilters: UserQueryFilter | undefined;
    isBulkLocalFilterOpen: boolean;
    filteredSelectedExternalUsers: SelectExternalUser[],
    isBulkUsersFiltered: boolean,
    isBulkLocalUsersFiltered: boolean
}

const initialUsersState: UsersState = {
    paging: {...DefaultPagination, pageSize: 10},
    isFilterOpen: false,
    statusList: [],
    invitationStatusList: [],
    departments: [],
    jobTitles: [],
    filters: undefined,
    bulkPaging: {...DefaultPagination},
    isBulkFilterOpen: false,
    bulkFilters: undefined,
    externalDepartments: [],
    externalJobTitles: [],
    selectedExternalUsers: [],
    selectedUsersLocalPagination: {...DefaultPagination},
    bulkLocalFilters: undefined,
    isBulkLocalFilterOpen: false,
    filteredSelectedExternalUsers: [],
    isBulkUsersFiltered: false,
    isBulkLocalUsersFiltered: false
}

export default initialUsersState;
