
export interface LayoutState {
    isNavigationExpanded: boolean;
    isProfileMenuExpanded: boolean;
    isCcpVisible: boolean;
    isHotspotsVisible: boolean;
    isStatusBarVisible: boolean;
}

const initialState: LayoutState = {
    isNavigationExpanded: false,
    isProfileMenuExpanded: false,
    isCcpVisible: true,
    isHotspotsVisible: false,
    isStatusBarVisible: false
}
export default initialState;
