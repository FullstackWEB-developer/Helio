import { BotContext } from '../models/bot-context';
import {CCPConnectionStatus} from '../models/connection-status.enum';
import {InternalCallDetails} from '@pages/ccp/models/internal-call-details';
import {CcpNotificationContent} from '../models/ccp-notification-content.model';

export interface CcpState {
    chatCounter: number;
    voiceCounter: number;
    contextPanel: string;
    botContexts: BotContext[];
    connectionStatus: CCPConnectionStatus;
    currentContactId: string;
    internalCallDetails?: InternalCallDetails;
    initiateInternalCall: boolean;
    notificationContent?: CcpNotificationContent;
    parentTicketId: string;
}

const initialState: CcpState = {
    chatCounter: 0,
    voiceCounter: 0,
    contextPanel: '',
    botContexts: [],
    connectionStatus: CCPConnectionStatus.None,
    currentContactId: '',
    internalCallDetails: undefined,
    initiateInternalCall: false,
    notificationContent: undefined,
    parentTicketId: ''
}

export default initialState;
