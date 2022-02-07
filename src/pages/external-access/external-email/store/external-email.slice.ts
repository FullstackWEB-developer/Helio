import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {EmailMessageDto} from '@shared/models';
import initialExternalEmailState from '@pages/external-access/external-email/store/external-email.initial-state';

const externalEmailSlice = createSlice({
    name: 'externalEmailSlice',
    initialState: initialExternalEmailState,
    reducers: {
        setExternalEmails(state, { payload }: PayloadAction<EmailMessageDto[]>) {
            state.emails = payload;
        },
        setMarkAsRead(state, {payload}: PayloadAction<boolean>) {
            state.markAsRead = payload;
        }
    }
});

export const {
    setExternalEmails,
    setMarkAsRead
} = externalEmailSlice.actions;

export default externalEmailSlice.reducer;
