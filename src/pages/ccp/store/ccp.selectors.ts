import { RootState } from '../../../app/store';
import { BotContext } from '../models/bot-context';
import { CcpNote } from '../models/ccp-note.model';

export const selectChatCounter = (state: RootState) => state.ccpState.chatCounter;
export const selectVoiceCounter = (state: RootState) => state.ccpState.voiceCounter;
export const selectContextPanel = (state: RootState) => state.ccpState.contextPanel as string;
export const selectBotContext = (state: RootState) => state.ccpState.botContext as BotContext;
export const selectNoteContext = (state: RootState) => state.ccpState.noteContext as CcpNote;
