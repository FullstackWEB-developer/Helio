import {RootState} from '../../../app/store';
import {createSelector} from '@reduxjs/toolkit';

export const layoutState = (state: RootState) => state.layoutState

export const isNavigationExpandedSelector = createSelector(
    layoutState,
    state => state.isNavigationExpanded
)

export const isProfileMenuExpandedSelector = createSelector(
    layoutState,
    state => state.isProfileMenuExpanded
)

export const isCcpVisibleSelector = createSelector(
    layoutState,
    state => state.isCcpVisible
)

export const selectIsHotspotsVisible = createSelector(
    layoutState,
    state => state.isHotspotsVisible
)

export const selectIsStatusBarVisible = createSelector(
    layoutState,
    state => state.isStatusBarVisible
)

export const selectLatestUsersStatusUpdateTime = createSelector(
    layoutState,
    state => state.latestUsersStatusUpdateTime as Date
)

export const selectLastNavigationDate = createSelector(
    layoutState,
    state => state.lastNavigationDate
)