import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
export const verifyPatientState = (state: RootState) => state.externalAccessState.verifyPatientState;

export const selectRedirectLink = createSelector(
    verifyPatientState,
    items => items.redirectLink as RedirectLink
)

export const selectExternalUserPhoneNumber = createSelector(
    verifyPatientState,
    items => items.phoneNumber as string
)

export const selectExternalUserEmail = createSelector(
    verifyPatientState,
    items => items.email as string
)


export const selectIsVerified = createSelector(
    verifyPatientState,
    items => items.isVerified as boolean
)

export const selectPreventRetryUntil = createSelector(
    verifyPatientState,
    items => items.preventRetryUntil as Date
)

export const selectRetryPrevented = createSelector(
    verifyPatientState,
    items => items.retryPrevented as boolean
)
