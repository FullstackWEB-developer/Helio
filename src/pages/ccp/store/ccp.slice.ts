import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './ccp.initial-state';
import {BotContext} from "../models/bot-context";

const ccpSlice = createSlice({
    name: 'ccp',
    initialState,
    reducers: {
        setChatCounter: (state, {payload}: PayloadAction<number>) => {
            state.chatCounter = payload;
        },
        setVoiceCounter: (state, {payload}: PayloadAction<number>) => {
            state.voiceCounter = payload;
        },
        setContextPanel: (state, {payload}: PayloadAction<string>) => {
            state.contextPanel = payload;
        },
        setBotContext: (state, {payload}: PayloadAction<BotContext>) => {
            state.botContext = payload;
        }
    }
});

export const { setChatCounter, setVoiceCounter, setContextPanel, setBotContext } = ccpSlice.actions;

export default ccpSlice.reducer;
