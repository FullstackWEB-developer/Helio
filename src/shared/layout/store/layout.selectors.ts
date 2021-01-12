import { RootState } from "../../../app/store";

export const isNavigationExpandedSelector = (state: RootState) => state.layoutState.isNavigationExpanded;