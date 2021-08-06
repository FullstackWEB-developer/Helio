import {TicketEnumValue} from "@pages/tickets/models/ticket-enum-value.model";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {Paging} from "@shared/models";
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
    setUserFilters
} = usersSlice.actions;

export default usersSlice.reducer;