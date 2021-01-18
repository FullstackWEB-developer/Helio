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
        }
    }
});

export const { toggleNavigation, toggleUserProfileMenu } = layoutSlice.actions

export default layoutSlice.reducer
