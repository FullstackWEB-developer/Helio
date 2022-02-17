import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialEmailState from '@pages/email/store/email.initial-state';
import {TicketMessageSummary} from '@shared/models';

const emailSlice = createSlice({
    name: 'emailSlice',
    initialState: initialEmailState,
    reducers: {
        setMessageSummaries(state, {payload}: PayloadAction<TicketMessageSummary[]>) {
            state.messageSummaries = payload;
            state.unreadEmails = state.messageSummaries.filter(a => a.unreadCount > 0).map(a => {
                return {
                    ticketId: a.ticketId,
                    count: a.unreadCount
                }
            });
        },
        appendUnreadEmailTicketId(state, {payload}: PayloadAction<string>) {
            if (!state.unreadEmails.find(a => a.ticketId === payload)) {
                state.unreadEmails.push({
                    ticketId: payload,
                    count: 1
                });
            } else {
                const index = state.unreadEmails.findIndex(a => a.ticketId === payload);
                state.unreadEmails[index] = {...state.unreadEmails[index], count: state.unreadEmails[index].count + 1}
            }
        },
        removeUnreadEmailTicketId(state, {payload}: PayloadAction<string>) {
            const messageIndex = state.messageSummaries.findIndex(a => a.ticketId === payload);
            if (messageIndex > -1) {
                state.messageSummaries[messageIndex] = {...state.messageSummaries[messageIndex], unreadCount: 0 }
            }
            state.unreadEmails = state.unreadEmails.filter(a => a.ticketId !== payload);
        },
        setLastEmailDate(state) {
            state.lastEmailDate = new Date();
        },
        setEmailHasFilter(state, {payload}: PayloadAction<boolean>) {
            state.hasFilter = payload;
        }
    }
});

export const {
    setMessageSummaries,
    appendUnreadEmailTicketId,
    removeUnreadEmailTicketId,
    setLastEmailDate,
    setEmailHasFilter
} = emailSlice.actions

export default emailSlice.reducer
