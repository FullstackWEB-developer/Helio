import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './layout.initial-state';

const layoutSlice = createSlice({
    name: 'layout',
    initialState,
    reducers: {
        toggleNavigation(state) {
            state.isNavigationExpanded = !state.isNavigationExpanded
        },
        toggleUserProfileMenu(state, {payload}: PayloadAction<boolean>) {
            state.isProfileMenuExpanded = payload
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
        toggleStatusBar(state) {
            state.isStatusBarVisible = !state.isStatusBarVisible;
        },
        updateLatestUsersStatusUpdateTime(state) {
            state.latestUsersStatusUpdateTime = new Date();
        },
        resetState(state) {
            state.isCcpVisible = false;
            state.isNavigationExpanded = false;
            state.isProfileMenuExpanded = false;
        },
        setLastNavigationDate(state) {
            state.lastNavigationDate = new Date();
        },
        setIncomingOrActiveCallFlag(state, {payload}: PayloadAction<boolean>){
            state.incomingOrActiveCallInProgress = payload;
        }
    }
});

export const {
    toggleNavigation,
    toggleUserProfileMenu,
    toggleCcp,
    showCcp,
    resetState,
    toggleHotspots,
    toggleStatusBar,
    updateLatestUsersStatusUpdateTime,
    setLastNavigationDate,
    setIncomingOrActiveCallFlag
} = layoutSlice.actions

export default layoutSlice.reducer
