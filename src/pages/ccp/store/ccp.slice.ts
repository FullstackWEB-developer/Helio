import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialState from './ccp.initial-state';
import {BotContext} from '../models/bot-context';
import {CCPConnectionStatus} from '../models/connection-status.enum';
import {TicketNote} from '@pages/tickets/models/ticket-note';
import {Ticket} from '@pages/tickets/models/ticket';
import {ExtendedPatient} from '@pages/patients/models/extended-patient';

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
        setBotContextTicket: (state, {payload}: PayloadAction<{ ticket: Ticket }>) => {
            const botContext = state.botContexts.find(a => a.initialContactId === payload.ticket.id);
            if (!!botContext) {
                botContext.ticket = payload.ticket;
            }
        },
        setBotContextPatient: (state, {payload}: PayloadAction<{ contactId: string, patient: ExtendedPatient }>) => {
            const botContext = state.botContexts.find(a => a.initialContactId === payload.contactId);
            if (!!botContext) {
                botContext.patient = payload.patient;
            }
        },
        upsertCurrentBotContext:(state, {payload}: PayloadAction<BotContext>) => {
            if (payload) {
                const currentBotContextIndex = state.botContexts.findIndex(a => a.initialContactId === payload.initialContactId);
                const index = currentBotContextIndex > -1 ? currentBotContextIndex : state.botContexts.length;
                state.botContexts[index] = payload;
            }
        },
        addNoteToTicket: (state, {payload}: PayloadAction<{ ticketId: string, note: TicketNote }>) => {
            const botContextIndex = state.botContexts.findIndex(a => a.initialContactId === payload.ticketId);
            const botContext = state.botContexts[botContextIndex];
            const notes = botContext?.ticket?.notes || [];
            state.botContexts[botContextIndex] = {
                ...botContext,
                ticket: {
                    ...botContext.ticket,
                    notes: [...notes, payload.note]
                }
            }
        },
        removeCurrentBotContext: (state, {payload}: PayloadAction<string>) => {
            const contextLength = state.botContexts.length;
            const index = state.botContexts.findIndex(a => a.currentContactId === payload);
            state.botContexts = state.botContexts.filter(a => a.currentContactId !== payload);
            if (contextLength === 1) {
                state.contextPanel = "";
                state.currentContactId = "";
            } else {
                state.currentContactId = index === state.botContexts.length ? state.botContexts[index-1].currentContactId : state.botContexts[index].currentContactId;
            }
        },
        setConnectionStatus: (state, {payload}: PayloadAction<CCPConnectionStatus>) => {
            state.connectionStatus = payload;
        },
        setCurrentContactId: (state, {payload}: PayloadAction<string>) => {
            state.currentContactId = payload;
        },
        clearCCPContext:(state) => {
            state.currentContactId = "";
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
    setConnectionStatus,
    clearCCPContext,
    addNoteToTicket,
    setBotContextTicket,
    setBotContextPatient,
    setCurrentContactId} = ccpSlice.actions;

export default ccpSlice.reducer;
