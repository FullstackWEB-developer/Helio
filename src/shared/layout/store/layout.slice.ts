import { createSlice } from '@reduxjs/toolkit';
import initialState from './layout.initial-state';
const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleNavigation(state) {
            state.isNavigationExpanded = !state.isNavigationExpanded
        }
    }
});

export const { toggleNavigation } = layoutSlice.actions

export default layoutSlice.reducer
