import { RootState } from "../../../app/store";

export const isNavigationExpandedSelector = (state: RootState) => state.layoutState.isNavigationExpanded;
export const isProfileMenuExpandedSelector = (state: RootState) => state.layoutState.isProfileMenuExpanded;
export const isCcpVisibleSelector = (state: RootState) => state.layoutState.isCcpVisible;
