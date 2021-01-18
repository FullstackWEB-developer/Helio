
export interface LayoutState {
    isNavigationExpanded: boolean;
    isProfileMenuExpanded: boolean;
}

const initialState: LayoutState = {
    isNavigationExpanded: false,
    isProfileMenuExpanded: false
}
export default initialState;