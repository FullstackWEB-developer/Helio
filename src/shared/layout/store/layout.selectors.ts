import { RootState } from '../../../app/store';
import { createSelector } from '@reduxjs/toolkit';
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
