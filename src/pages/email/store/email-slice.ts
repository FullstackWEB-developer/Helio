import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialEmailState from '@pages/email/store/email.initial-state';
import {TicketMessageSummary} from '@shared/models';


const emailSlice = createSlice({
    name: 'emailSlice',
    initialState: initialEmailState,
    reducers: {
        setMessageSummaries(state, {payload}: PayloadAction<TicketMessageSummary[]>) {
            state.messageSummaries = payload;
        },
        removeUnreadEmailTicketId(state, {payload}: PayloadAction<string>) {
            const messageIndex = state.messageSummaries.findIndex(a => a.ticketId === payload);
            if (messageIndex > -1) {
                state.messageSummaries[messageIndex] = {...state.messageSummaries[messageIndex], unreadCount: 0 }
            }
        },
        setUnreadEmailMessages(state, {payload}: PayloadAction<number>){
            state.unreadEmails = payload
        },
        setLastEmailDate(state) {
            state.lastEmailDate = new Date();
        },
        setEmailHasFilter(state, {payload}: PayloadAction<boolean>) {
            state.hasFilter = payload;
        },
        setUnreadTeamEmail(state, {payload}: PayloadAction<number>){
            state.unreadTeamEmails = payload
        },
        setEmailNewTicketId(state, {payload}: PayloadAction<string | undefined>){
            state.newTicketId = payload
        },
    }
});

export const {
    setMessageSummaries,
    removeUnreadEmailTicketId,
    setLastEmailDate,
    setEmailHasFilter,
    setUnreadEmailMessages,
    setUnreadTeamEmail,
    setEmailNewTicketId
} = emailSlice.actions

export default emailSlice.reducer
