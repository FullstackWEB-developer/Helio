import { createSlice } from '@reduxjs/toolkit';
import initialState from './layout.initial-state';
const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleNavigation(state) {
            state.isNavigationExpanded = !state.isNavigationExpanded
        },
        toggleUserProfileMenu(state) {
            state.isProfileMenuExpanded = !state.isProfileMenuExpanded
        },
        toggleCcp(state) {
            state.isCcpVisible = !state.isCcpVisible
        }
    }
});

export const { toggleNavigation, toggleUserProfileMenu, toggleCcp } = layoutSlice.actions

export default layoutSlice.reducer
