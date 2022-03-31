import { BotContext } from '../models/bot-context';
import {CCPConnectionStatus} from '../models/connection-status.enum';
import {InternalCallDetails} from '@pages/ccp/models/internal-call-details';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContexts: BotContext[];
    connectionStatus: CCPConnectionStatus;
    currentContactId: string;
    internalCallDetails?: InternalCallDetails;
    initiateInternalCall: boolean;

}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContexts: [],
    connectionStatus: CCPConnectionStatus.None,
    currentContactId: '',
    internalCallDetails: undefined,
    initiateInternalCall: false
}

export default initialState;
