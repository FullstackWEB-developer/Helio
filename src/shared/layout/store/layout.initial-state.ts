
export interface LayoutState {
    isNavigationExpanded: boolean;
    isProfileMenuExpanded: boolean;
    isCcpVisible: boolean;
}

const initialState: LayoutState = {
    isNavigationExpanded: false,
    isProfileMenuExpanded: false,
    isCcpVisible: true
}
export default initialState;
