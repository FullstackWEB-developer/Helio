import { RootState } from "../../../../app/store";

export const selectRedirectLink = (state: RootState) => state.redirectLinkState.redirectLink;
export const selectIsRedirectLinkLoading = (state: RootState) => state.redirectLinkState.isLoading;
export const selectIsRedirectLinkError = (state: RootState) => state.redirectLinkState.isError;
