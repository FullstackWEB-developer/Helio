import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';
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


export const selectVerifiedLink = createSelector(
    verifyPatientState,
    items => items.verifiedLink
)

export const selectPreventRetryUntil = createSelector(
    verifyPatientState,
    items => items.preventRetryUntil as Date
)

export const selectRetryPrevented = createSelector(
    verifyPatientState,
    items => items.retryPrevented as boolean
)

export const selectVerificationChannel = createSelector(
    verifyPatientState,
    items => items.verificationChannel as VerificationType
)

export const select2FACodeResendDisabled = createSelector(
    verifyPatientState,
    items => items.twoFACodeResendDisabled as boolean
)

export const selectLast2FACodeSentTimestamp = createSelector(
    verifyPatientState,
    items => items.lastTwoFACodeSentTimestamp as Date
)