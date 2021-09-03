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
        setExternalUserPhoneNumber(state, { payload }: PayloadAction<string>) {
            state.phoneNumber = payload;
        },
        setExternalUserEmail(state, { payload }: PayloadAction<string>) {
            state.email = payload;
        },
        setIsVerified(state, { payload }: PayloadAction<boolean>) {
            state.isVerified = payload;
        },
        setPreventRetryUntil(state, { payload }: PayloadAction<Date| undefined>) {
            state.preventRetryUntil = payload;
        },
        setRetryPrevented(state, { payload }: PayloadAction<boolean>) {
            state.retryPrevented = payload;
        }
    }
});

export const {
    setRedirectLink,
    setExternalUserPhoneNumber,
    setExternalUserEmail,
    setIsVerified,
    setPreventRetryUntil,
    setRetryPrevented
} = verifyPatientSlice.actions;

export default verifyPatientSlice.reducer;
