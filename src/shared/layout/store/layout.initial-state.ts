export interface LayoutState {
    isNavigationExpanded: boolean;
    isProfileMenuExpanded: boolean;
    isCcpVisible: boolean;
    isHotspotsVisible: boolean;
    isStatusBarVisible: boolean;
    latestUsersStatusUpdateTime?: Date;
    lastNavigationDate?: Date;
    incomingOrActiveCallInProgress: boolean;
}

const initialState: LayoutState = {
    isNavigationExpanded: false,
    isProfileMenuExpanded: false,
    isCcpVisible: true,
    isHotspotsVisible: false,
    isStatusBarVisible: false,
    incomingOrActiveCallInProgress: false
}
export default initialState;
