import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialChatLogState from '@pages/chat-log/store/chat-log.initial-state';

const chatLogSlice = createSlice({
    name: 'chatLogSlice',
    initialState: initialChatLogState,
    reducers: {
        setIsChatLogFiltered(state, {payload}: PayloadAction<boolean>) {
            state.isFiltered = payload;
        }
    }
});

export const {
    setIsChatLogFiltered
} = chatLogSlice.actions

export default chatLogSlice.reducer
