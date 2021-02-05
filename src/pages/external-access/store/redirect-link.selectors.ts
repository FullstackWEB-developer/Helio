import { RootState } from "../../../app/store";

export const selectRedirectLink = (state: RootState) => state.redirectLinkState.redirectLink;
export const selectIsAppointmentLoading = (state: RootState) => state.redirectLinkState.isLoading;
export const selectIsAppointmentError = (state: RootState) => state.redirectLinkState.isError;
