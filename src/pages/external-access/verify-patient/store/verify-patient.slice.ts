import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {RedirectLink} from '@pages/external-access/verify-patient/models/redirect-link';
import initialVerifyPatientState from '@pages/external-access/verify-patient/store/verify-patient.initial-state';

const verifyPatientSlice = createSlice({
    name: 'verifyPatientSlice',
    initialState: initialVerifyPatientState,
    reducers: {
        setRedirectLink(state, { payload }: PayloadAction<RedirectLink>) {
            state.redirectLink = payload;
            if (payload.sentAddress) {
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
        clearState(state) {
            state.retryPrevented = false;
            state.preventRetryUntil = undefined;
            state.verifiedLink = undefined;
            state.email = '';
            state.phoneNumber = '';
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
    clearRedirectLink
} = verifyPatientSlice.actions;

export default verifyPatientSlice.reducer;