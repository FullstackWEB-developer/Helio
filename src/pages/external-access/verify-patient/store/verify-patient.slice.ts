import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import initialVerifyPatientState from '@pages/external-access/verify-patient/store/verify-patient.initial-state';
import {ExternalAccessRequestTypes} from '@pages/external-access/models/external-updates-request-types.enum';
import {VerificationType} from '@pages/external-access/models/verification-type.enum';

const verifyPatientSlice = createSlice({
    name: 'verifyPatientSlice',
    initialState: initialVerifyPatientState,
    reducers: {
        setRedirectLink(state, { payload }: PayloadAction<RedirectLink>) {
            state.redirectLink = payload;
            if (payload.sentAddress && payload.requestType !== ExternalAccessRequestTypes.SentTicketMessageViaEmail) {
                state.phoneNumber = payload.sentAddress;
            }
        },
        clearRedirectLink(state){
            state.redirectLink = undefined
            state.verifiedLink = ''
        },
        setExternalUserPhoneNumber(state, { payload }: PayloadAction<string>) {
            state.phoneNumber = payload;
        },
        setExternalUserEmail(state, { payload }: PayloadAction<string>) {
            state.email = payload;
        },
        setVerifiedLink(state, { payload }: PayloadAction<string>) {
            state.verifiedLink = payload;
        },
        setPreventRetryUntil(state, { payload }: PayloadAction<Date| undefined>) {
            state.preventRetryUntil = payload;
        },
        setRetryPrevented(state, { payload }: PayloadAction<boolean>) {
            state.retryPrevented = payload;
        },
        setVerificationCodeChannel(state, { payload }: PayloadAction<VerificationType>) {
            state.verificationChannel = payload;
        },
        clearState(state) {
            state.retryPrevented = false;
            state.preventRetryUntil = undefined;
            state.verifiedLink = undefined;
            state.email = '';
            state.phoneNumber = '';
            state.verificationChannel = undefined;
        }
    }
});

export const {
    setRedirectLink,
    setExternalUserPhoneNumber,
    setExternalUserEmail,
    setVerifiedLink,
    setPreventRetryUntil,
    setRetryPrevented,
    clearState,
    clearRedirectLink,
    setVerificationCodeChannel
} = verifyPatientSlice.actions;

export default verifyPatientSlice.reducer;
