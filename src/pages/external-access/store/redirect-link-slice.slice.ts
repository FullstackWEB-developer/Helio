import { RedirectLink } from './../hipaa-verification/models/redirect-link';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import initialState from './redirect-link.initial-state';

const redirectLinkSlice = createSlice({
    name: 'redirectLink',
    initialState,
    reducers: {
        setLoading(state, { payload }: PayloadAction<boolean>) {
            state.isLoading = payload;
        },
        setError(state, { payload }: PayloadAction<boolean>) {
            state.isError = payload;
        },
        setRedirectLink(state, { payload }: PayloadAction<RedirectLink>) {
            state.redirectLink = payload;
        },
        clearRedirectLink(state) {
            state.redirectLink = undefined;
        }
    }
});

export const { setLoading, setError, setRedirectLink, clearRedirectLink } = redirectLinkSlice.actions;

export default redirectLinkSlice.reducer;
