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
        },
        showCcp(state) {
            state.isCcpVisible = true;
        },
        toggleHotspots(state) {
            state.isHotspotsVisible = !state.isHotspotsVisible
        },
        resetState(state) {
            state.isCcpVisible = false;
            state.isNavigationExpanded = false;
            state.isProfileMenuExpanded = false;
        }
    }
});

export const { toggleNavigation, toggleUserProfileMenu, toggleCcp, showCcp, resetState, toggleHotspots } = layoutSlice.actions

export default layoutSlice.reducer
