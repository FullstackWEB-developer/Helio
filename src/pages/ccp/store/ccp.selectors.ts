import {RootState} from '@app/store';
import {BotContext} from '../models/bot-context';
import {CcpNote} from '../models/ccp-note.model';
import {TicketNote} from '../../tickets/models/ticket-note';
import {CCPConnectionStatus} from '../models/connection-status.enum';

export const selectChatCounter = (state: RootState) => state.ccpState.chatCounter;
export const selectVoiceCounter = (state: RootState) => state.ccpState.voiceCounter;
export const selectContextPanel = (state: RootState) => state.ccpState.contextPanel as string;
export const selectBotContexts = (state: RootState) => state.ccpState.botContexts as BotContext[];
export const selectBotContext = (state: RootState) => (state.ccpState.botContexts || []).find(a => a.id === state.ccpState.currentContactId) as BotContext;
export const selectNoteContext = (state: RootState) => state.ccpState.noteContext as CcpNote;
export const selectNotes = (state: RootState) => state.ccpState.notes as TicketNote[];
export const selectConnectionStatus = (state: RootState) => state.ccpState.connectionStatus as CCPConnectionStatus;
export const selectCurrentContactId = (state: RootState) => state.ccpState.currentContactId as string;
