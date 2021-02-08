import { createSelector } from '@reduxjs/toolkit';
import { RootState } from "../../../../app/store";
import { RedirectLink } from '../models/redirect-link';
export const selectRedirectLinkState = (state: RootState) => state.externalAccessState.redirectLinkState;

export const selectRedirectLink = createSelector(
    selectRedirectLinkState,
    state => state.redirectLink as RedirectLink
)

export const selectIsRedirectLinkLoading = createSelector(
    selectRedirectLinkState,
    state => state.isLoading as boolean
)

export const selectIsRedirectLinkError = createSelector(
    selectRedirectLinkState,
    state => state.isError as boolean
)