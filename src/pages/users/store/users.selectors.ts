import {RootState} from "@app/store";
import {TicketEnumValue} from "@pages/tickets/models/ticket-enum-value.model";
import {Paging, SelectExternalUser} from "@shared/models";
import {UserQueryFilter} from "../models/user-filter-query.model";

export const selectUsersPaging = (state: RootState) => state.usersState.paging as Paging;
export const selectIsUsersFilterOpen = (state: RootState) => state.usersState.isFilterOpen as boolean;
export const selectUserStatusList = (state: RootState) => state.usersState.statusList as TicketEnumValue[];
export const selectUserInvitationStatusList = (state: RootState) => state.usersState.invitationStatusList as TicketEnumValue[];
export const selectUserDepartments = (state: RootState) => state.usersState.departments as string[];
export const selectUserJobTitles = (state: RootState) => state.usersState.jobTitles as string[];
export const selectUserFilters = (state: RootState) => state.usersState.filters as UserQueryFilter;
export const selectBulkUsersPaging = (state: RootState) => state.usersState.bulkPaging as Paging;
export const selectIsBulkUsersFilterOpen = (state: RootState) => state.usersState.isBulkFilterOpen as boolean;
export const selectBulkFilters = (state: RootState) => state.usersState.bulkFilters as UserQueryFilter;
export const selectUserExternalDepartments = (state: RootState) => state.usersState.externalDepartments as string[];
export const selectExternalUserJobTitles = (state: RootState) => state.usersState.externalJobTitles as string[];
export const selectExternalUsersSelection = (state: RootState) => state.usersState.selectedExternalUsers as SelectExternalUser[];
export const selectSelectedUsersLocalPagination = (state: RootState) => state.usersState.selectedUsersLocalPagination as Paging;
export const selectAllSelectedUsersAssignedRole = (state: RootState) => {
    return state.usersState.selectedExternalUsers?.every((u: SelectExternalUser) => u.inviteUserModel?.roles?.length) as boolean;
}
export const selectLocalBulkFilters = (state: RootState) => state.usersState.bulkLocalFilters as UserQueryFilter;
export const selectIsLocalBulkFilterOpen = (state: RootState) => state.usersState.isBulkLocalFilterOpen as boolean;
export const selectIsBulkUsersFiltered = (state: RootState) => state.usersState.isBulkUsersFiltered as boolean;
export const selectFilteredExternalUsersSelection = (state: RootState) => state.usersState.filteredSelectedExternalUsers as SelectExternalUser[];
