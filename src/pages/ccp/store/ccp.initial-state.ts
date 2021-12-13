import { BotContext } from '../models/bot-context';
import {CCPConnectionStatus} from '../models/connection-status.enum';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContexts: BotContext[];
    connectionStatus: CCPConnectionStatus;
    currentContactId: string;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContexts: [],
    connectionStatus: CCPConnectionStatus.None,
    currentContactId: ''
}

export default initialState;
