import { BotContext } from '../models/bot-context';
import { CcpNote } from '../models/ccp-note.model';
import { TicketNote } from '../../tickets/models/ticket-note';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContext?: BotContext;
    noteContext?: CcpNote;
    notes?: TicketNote[];
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContext: undefined,
    noteContext: undefined,
    notes: undefined
}

export default initialState;
