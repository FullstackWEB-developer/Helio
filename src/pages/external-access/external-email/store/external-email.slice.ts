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
        setEmailMarkAsRead(state, {payload}: PayloadAction<{ id: string }>) {
            let index = state.emails.findIndex(a => a.id === payload.id);
            if (index > -1) {
                let newEmails = [...state.emails];
                newEmails[index].isRead = true;
                state.emails = newEmails;
            }
        }
    }
});

export const {
    setExternalEmails,
    setEmailMarkAsRead
} = externalEmailSlice.actions;

export default externalEmailSlice.reducer;
