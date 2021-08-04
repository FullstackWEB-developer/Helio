import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './ccp.initial-state';
import {BotContext} from '../models/bot-context';
import {CcpNote} from '../models/ccp-note.model';
import {TicketNote} from '../../tickets/models/ticket-note';
import {CCPConnectionStatus} from '../models/connection-status.enum';

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
        setBotContext: (state, {payload}: PayloadAction<BotContext | undefined>) => {
            state.botContext = payload;
        },
        setNoteContext: (state, {payload}: PayloadAction<CcpNote>) => {
            state.noteContext = payload;
        },
        setNotes: (state, {payload}: PayloadAction<TicketNote[]>) => {
            state.notes = payload;
        },
        setConnectionStatus: (state, {payload}: PayloadAction<CCPConnectionStatus>) => {
            state.connectionStatus = payload;
        },
        setCurrentContactId: (state, {payload}: PayloadAction<string>) => {
            state.currentContactId = payload;
        }
    }
});

export const {
    setChatCounter,
    setVoiceCounter, 
    setContextPanel,
    setBotContext,
    setNoteContext,
    setNotes,
    setConnectionStatus,
    setCurrentContactId} = ccpSlice.actions;

export default ccpSlice.reducer;
