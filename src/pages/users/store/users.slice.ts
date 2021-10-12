import {TicketEnumValue} from "@pages/tickets/models/ticket-enum-value.model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Paging, SelectExternalUser} from "@shared/models";
import {UserQueryFilter} from "../models/user-filter-query.model";
import initialUsersState from "./users.initial-state";

const usersSlice = createSlice({
    name: 'users',
    initialState: initialUsersState,
    reducers: {
        setUsersPagination(state, {payload}: PayloadAction<Paging>) {
            state.paging = payload
        },
        setIsFilterOpen(state, {payload}: PayloadAction<boolean>) {
            state.isFilterOpen = payload
        },
        setUserDepartments(state, {payload}: PayloadAction<string[]>) {
            state.departments = payload
        },
        setUserJobTitles(state, {payload}: PayloadAction<string[]>) {
            state.jobTitles = payload
        },
        setUserStatusList(state, {payload}: PayloadAction<TicketEnumValue[]>) {
            state.statusList = payload
        },
        setInvitationStatusList(state, {payload}: PayloadAction<TicketEnumValue[]>) {
            state.invitationStatusList = payload
        },
        setUserFilters(state, {payload}: PayloadAction<{filters: UserQueryFilter | undefined, resetPagination: boolean}>) {
            state.filters = payload.filters
            if (payload.resetPagination) {
                state.paging = {
                    ...state.paging,
                    page: 1
                }
            }
        },
        setBulkUsersPagination(state, {payload}: PayloadAction<Paging>) {
            state.bulkPaging = payload;
        },
        setBulkUsersFiltered(state, {payload}: PayloadAction<boolean>) {
            state.isBulkUsersFiltered = payload;
        },
        setIsBulkFilterOpen(state, {payload}: PayloadAction<boolean>) {
            state.isBulkFilterOpen = payload
        },
        setBulkUserFilters(state, {payload}: PayloadAction<{filters: UserQueryFilter | undefined, resetPagination: boolean}>) {
            state.bulkFilters = payload.filters
            if (payload.resetPagination) {
                state.bulkPaging = {
                    ...state.bulkPaging,
                    page: 1
                }
            }
        },
        setUserExternalDepartments(state, {payload}: PayloadAction<string[]>) {
            state.externalDepartments = payload
        },
        setExternalUserJobTitles(state, {payload}: PayloadAction<string[]>) {
            state.externalJobTitles = payload
        },
        addExternalUserToSelection(state, {payload}: PayloadAction<SelectExternalUser>) {
            if (!state.selectedExternalUsers.some(u => u.id === payload.id)) {
                state.selectedExternalUsers = [...state.selectedExternalUsers, payload];
            }
        },
        removeExternalUserFromSelection(state, {payload}: PayloadAction<string>) {
            state.selectedExternalUsers = state.selectedExternalUsers.filter(u => u.id !== payload);
        },
        clearAllSelectedUsers(state) {
            state.selectedExternalUsers = [];
        },
        selectAllExternalUsersOnCurrentPage(state, {payload}: PayloadAction<SelectExternalUser[]>) {
            state.selectedExternalUsers.push(...payload);
        },
        clearAllExternalUsersSelectionOnCurrentPage(state, {payload}: PayloadAction<string[]>) {
            state.selectedExternalUsers = state.selectedExternalUsers.filter(u => !payload.includes(u.id));
        },
        setSelectedUsersLocalPagination(state, {payload}: PayloadAction<Paging>) {
            state.selectedUsersLocalPagination = payload;
        },
        setSelectedUserRole(state, {payload}: PayloadAction<{userId: string, role: string}>) {
            state.selectedExternalUsers = state.selectedExternalUsers.map(u => {
                if (u.id === payload.userId) {
                    u = {
                        ...u,
                        inviteUserModel: {
                            ...u.inviteUserModel,
                            roles: [payload.role]
                        }
                    }
                }
                return u;
            });
        },
        setRoleToAllSelectedUsers(state, {payload}: PayloadAction<string>) {
            state.selectedExternalUsers = state.selectedExternalUsers.map(u => (
                u = {
                    ...u,
                    inviteUserModel: {
                        ...u.inviteUserModel,
                        roles: [payload]
                    }
                }
            ));
        },
        setLocalBulkFilters(state, {payload}: PayloadAction<{filters: UserQueryFilter | undefined, resetPagination: boolean}>) {
            if (payload.filters?.searchText?.length === 0) {
                delete payload.filters.searchText;
            }
            state.bulkLocalFilters = payload.filters;
            if (payload.resetPagination) {
                state.selectedUsersLocalPagination = {
                    ...state.selectedUsersLocalPagination,
                    page: 1
                }
            }
            if (payload?.filters && Object.keys(payload.filters).length > 0) {
                const {departments, jobTitle, roles, searchText, rolesUnassigned} = payload.filters;
                if (departments || jobTitle || roles || searchText || rolesUnassigned) {
                    let filteredSelection = [...state.selectedExternalUsers];
                    if (departments) {
                        filteredSelection = filteredSelection.filter((u: SelectExternalUser) => departments.split(';')?.includes(u?.info?.department || ''));
                    }
                    if (jobTitle) {
                        filteredSelection = filteredSelection.filter((u: SelectExternalUser) => jobTitle.split(';')?.includes(u?.info?.jobTitle || ''));
                    }
                    if (roles) {
                        filteredSelection = filteredSelection.filter((u: SelectExternalUser) => {
                            if (u?.inviteUserModel?.roles && u.inviteUserModel?.roles.length > 0) {
                                return roles.split(';').includes(u.inviteUserModel?.roles[0]);
                            }
                        })
                    }
                    if(rolesUnassigned){
                        filteredSelection = filteredSelection.filter((u: SelectExternalUser) => !u.inviteUserModel?.roles)
                    }
                    if (searchText !== '') {
                        const searchTermLower = searchText?.toLowerCase();
                        filteredSelection = filteredSelection.filter((u: SelectExternalUser) =>
                            u.info?.displayName?.toLowerCase()?.includes(searchTermLower || '') ||
                            u.info?.department?.toLowerCase()?.includes(searchTermLower || '') ||
                            u.info?.jobTitle?.toLowerCase()?.includes(searchTermLower || ''));
                    }
                    state.filteredSelectedExternalUsers = filteredSelection;
                }
                else {
                    state.filteredSelectedExternalUsers = [];
                }
            }
            else {
                state.filteredSelectedExternalUsers = [];
            }
        },
        setIsLocalBulkFilterOpen(state, {payload}: PayloadAction<boolean>) {
            state.isBulkLocalFilterOpen = payload;
        },
        setSelectedUserProviderMapping(state, {payload}: PayloadAction<{userId: string, providerId: string}>) {
            state.selectedExternalUsers = state.selectedExternalUsers.map(u => {
                if (u.id === payload.userId) {
                    u = {
                        ...u,
                        inviteUserModel: {
                            ...u.inviteUserModel,
                            providerId: payload.providerId
                        }
                    }
                }
                return u;
            });
        },
        clearSelectedUserProviderMapping(state, {payload}: PayloadAction<string>){
            state.selectedExternalUsers = state.selectedExternalUsers.map(u => {
                if (u.id === payload) {
                    delete u.inviteUserModel.providerId;
                }
                return u;
            });
        }
    }
});

export const {
    setUsersPagination,
    setIsFilterOpen,
    setUserDepartments,
    setUserJobTitles,
    setUserStatusList,
    setInvitationStatusList,
    setUserFilters,
    setBulkUsersPagination,
    setIsBulkFilterOpen,
    setBulkUserFilters,
    setUserExternalDepartments,
    setExternalUserJobTitles,
    addExternalUserToSelection,
    removeExternalUserFromSelection,
    clearAllSelectedUsers,
    selectAllExternalUsersOnCurrentPage,
    clearAllExternalUsersSelectionOnCurrentPage,
    setSelectedUsersLocalPagination,
    setSelectedUserRole,
    setRoleToAllSelectedUsers,
    setLocalBulkFilters,
    setIsLocalBulkFilterOpen,
    setSelectedUserProviderMapping,
    clearSelectedUserProviderMapping,
    setBulkUsersFiltered
} = usersSlice.actions;

export default usersSlice.reducer;
