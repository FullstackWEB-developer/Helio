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
        upsertCurrentBotContext:(state, {payload}: PayloadAction<BotContext>) => {
            if (payload) {
                const currentBotContextIndex = state.botContexts.findIndex(a => a.id === state.currentContactId);
                const index = currentBotContextIndex > -1 ? currentBotContextIndex : state.botContexts.length;
                state.botContexts[index] = {
                    ...payload,
                    id: state.currentContactId
                };
            }
        },
        removeCurrentBotContext: (state, {payload}: PayloadAction<string>) => {
            const contextLength = state.botContexts.length;
            const index = state.botContexts.findIndex(a => a.id === payload);
            state.botContexts = state.botContexts.filter(a => a.id !== payload);
            if (contextLength === 1) {
                state.contextPanel = "";
                state.currentContactId = "";
            } else {
                state.currentContactId = index === state.botContexts.length ? state.botContexts[index-1].id : state.botContexts[index].id;
            }
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
        },
        clearCCPContext:(state) => {
            state.currentContactId = "";
            state.notes = [];
            state.noteContext = undefined;
            state.botContexts = [];
        }
    }
});

export const {
    setChatCounter,
    setVoiceCounter, 
    setContextPanel,
    upsertCurrentBotContext,
    removeCurrentBotContext,
    setNoteContext,
    setNotes,
    setConnectionStatus,
    clearCCPContext,
    setCurrentContactId} = ccpSlice.actions;

export default ccpSlice.reducer;
