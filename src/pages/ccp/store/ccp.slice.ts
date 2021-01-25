import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './ccp.initial-state';

const ccpSlice = createSlice({
    name: 'ccp',
    initialState,
    reducers: {
        setChatCounter: (state, {payload}: PayloadAction<number>) => {
            state.chatCounter = payload;
        },
        setVoiceCounter: (state, {payload}: PayloadAction<number>) => {
            state.voiceCounter = payload;
        }
    }
});

export const { setChatCounter, setVoiceCounter } = ccpSlice.actions;

export default ccpSlice.reducer;
