import {ChannelTypes} from '@shared/models';

export interface AgentPerformanceByChannel {
    agent: string;
    channel: ChannelTypes;
    averageAfterContactWorkTime?: number;
    averageAgentInteractionTime?: number;
    averageCustomerHoldTime ?: number;
    averageHandleTime?: number;
    contactsHandled?: number
}
