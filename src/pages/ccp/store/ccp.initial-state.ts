import { BotContext } from '../models/bot-context';
import { CcpNote } from '../models/ccp-note.model';
import { TicketNote } from '../../tickets/models/ticket-note';
import {CCPConnectionStatus} from '../models/connection-status.enum';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContexts: BotContext[];
    noteContext?: CcpNote;
    notes?: TicketNote[];
    connectionStatus: CCPConnectionStatus;
    currentContactId: string;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContexts: [],
    noteContext: undefined,
    notes: undefined,
    connectionStatus: CCPConnectionStatus.None,
    currentContactId: ''
}

export default initialState;
