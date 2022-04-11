import {RootState} from '@app/store';
import {BotContext} from '../models/bot-context';
import {TicketNote} from '../../tickets/models/ticket-note';
import {CCPConnectionStatus} from '../models/connection-status.enum';
import {InternalCallDetails} from '@pages/ccp/models/internal-call-details';
import {CcpNotificationContent} from '../models/ccp-notification-content.model';

export const selectChatCounter = (state: RootState) => state.ccpState.chatCounter;
export const selectVoiceCounter = (state: RootState) => state.ccpState.voiceCounter;
export const selectHasActiveContact = (state: RootState) => state.ccpState.voiceCounter > 0 || state.ccpState.chatCounter > 0;
export const selectContextPanel = (state: RootState) => state.ccpState.contextPanel as string;
export const selectBotContext = (state: RootState) => (state.ccpState.botContexts || []).find(a => a.currentContactId === state.ccpState.currentContactId) as BotContext;
export const selectNotes = (state: RootState) => state.ccpState.notes as TicketNote[];
export const selectConnectionStatus = (state: RootState) => state.ccpState.connectionStatus as CCPConnectionStatus;
export const selectCurrentContactId = (state: RootState) => state.ccpState.currentContactId as string;
export const selectInternalCallDetails = (state: RootState) => state.ccpState.internalCallDetails as InternalCallDetails | undefined;
export const selectInitiateInternalCall = (state: RootState) => state.ccpState.initiateInternalCall as boolean;
export const selectCcpNotificationContent = (state: RootState) => state.ccpState.notificationContent as CcpNotificationContent | undefined;
