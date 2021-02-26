import { BotContext } from '../models/bot-context';
import { CcpNote } from '../models/ccp-note.model';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContext?: BotContext;
    noteContext?: CcpNote;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContext: undefined,
    noteContext: undefined,
}

export default initialState;
