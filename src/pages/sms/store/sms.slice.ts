import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TicketMessageSummary} from '@shared/models';
import initialSmsState from '@pages/sms/store/sms.initial-state';
const smsSlice = createSlice({
    name: 'smsSlice',
    initialState: initialSmsState,
    reducers: {
        setSmsMessageSummaries(state, {payload}: PayloadAction<TicketMessageSummary[]>) {
            state.messageSummaries = payload;
        },
        removeUnreadSmsTicketId(state, {payload}: PayloadAction<string>) {
            const messageIndex = state.messageSummaries.findIndex(a => a.ticketId === payload);
            if (messageIndex > -1) {
                state.messageSummaries[messageIndex] = {...state.messageSummaries[messageIndex], unreadCount: 0 }
            }
        },
        setUnreadSmsMessages(state, {payload}: PayloadAction<number>){
            state.unreadSmsMessages = payload
        },
        setLastSmsDate(state) {
            state.lastSmsDate = new Date();
        },
        setIsSmsFiltered(state, {payload}: PayloadAction<boolean>) {
            state.isFiltered = payload;
        }
    }
});

export const {
    setSmsMessageSummaries,
    removeUnreadSmsTicketId,
    setLastSmsDate,
    setIsSmsFiltered,
    setUnreadSmsMessages
} = smsSlice.actions

export default smsSlice.reducer
