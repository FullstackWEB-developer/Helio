import {RootState} from "@app/store";
import {TicketEnumValue} from "@pages/tickets/models/ticket-enum-value.model";
import {Paging} from "@shared/models";
import {UserQueryFilter} from "../models/user-filter-query.model";

export const selectUsersPaging = (state: RootState) => state.usersState.paging as Paging;
export const selectIsUsersFilterOpen = (state: RootState) => state.usersState.isFilterOpen as boolean;
export const selectUserStatusList = (state: RootState) => state.usersState.statusList as TicketEnumValue[];
export const selectUserInvitationStatusList = (state: RootState) => state.usersState.invitationStatusList as TicketEnumValue[];
export const selectUserDepartments = (state: RootState) => state.usersState.departments as string[];
export const selectUserJobTitles = (state: RootState) => state.usersState.jobTitles as string[];
export const selectUserFilters = (state: RootState) => state.usersState.filters as UserQueryFilter;