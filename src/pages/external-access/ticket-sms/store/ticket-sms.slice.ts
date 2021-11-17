import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {TicketMessage} from '@shared/models';
import initialTicketSmsState from '@pages/external-access/ticket-sms/store/ticket-sms.initial-state';

const ticketSmsSlice = createSlice({
    name: 'ticketSmsSlice',
    initialState: initialTicketSmsState,
    reducers: {
        setTicketSmsMessages(state, { payload }: PayloadAction<TicketMessage[]>) {
            state.messages = payload;
        },
        pushTicketSmsMessage(state, { payload }: PayloadAction<TicketMessage>) {
            state.messages.push(payload);
        }
    }
});

export const {
    setTicketSmsMessages,
    pushTicketSmsMessage
} = ticketSmsSlice.actions;

export default ticketSmsSlice.reducer;
