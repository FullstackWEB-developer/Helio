
export interface LayoutState {
    isNavigationExpanded: boolean;
    isProfileMenuExpanded: boolean;
    isCcpVisible: boolean;
    isHotspotsVisible: boolean
}

const initialState: LayoutState = {
    isNavigationExpanded: false,
    isProfileMenuExpanded: false,
    isCcpVisible: true,
    isHotspotsVisible: false
}
export default initialState;
