import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TicketMessageSummary} from '@shared/models';
import initialSmsState from '@pages/sms/store/sms.initial-state';
const smsSlice = createSlice({
    name: 'smsSlice',
    initialState: initialSmsState,
    reducers: {
        setSmsMessageSummaries(state, {payload}: PayloadAction<TicketMessageSummary[]>) {
            state.messageSummaries = payload;
            state.unreadSmsMessages = state.messageSummaries.filter(a => a.unreadCount > 0).map(a => {
                return {
                    ticketId: a.ticketId,
                    count: a.unreadCount
                }
            });
        },
        appendUnreadSmsTicketId(state, {payload}: PayloadAction<string>) {
            if (!state.unreadSmsMessages.find(a => a.ticketId === payload)) {
                state.unreadSmsMessages.push({
                    ticketId: payload,
                    count: 1
                });
            } else {
                const index = state.unreadSmsMessages.findIndex(a => a.ticketId === payload);
                state.unreadSmsMessages[index] = {...state.unreadSmsMessages[index], count: state.unreadSmsMessages[index].count + 1}
            }
        },
        removeUnreadSmsTicketId(state, {payload}: PayloadAction<string>) {
            const messageIndex = state.messageSummaries.findIndex(a => a.ticketId === payload);
            if (messageIndex > -1) {
                state.messageSummaries[messageIndex] = {...state.messageSummaries[messageIndex], unreadCount: 0 }
            }
            state.unreadSmsMessages = state.unreadSmsMessages.filter(a => a.ticketId !== payload);
        },
        setLastSmsDate(state) {
            state.lastSmsDate = new Date();
        }
    }
});

export const {
    setSmsMessageSummaries,
    appendUnreadSmsTicketId,
    removeUnreadSmsTicketId,
    setLastSmsDate
} = smsSlice.actions

export default smsSlice.reducer
