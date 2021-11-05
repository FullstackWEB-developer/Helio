import {ChannelTypes} from '@shared/models';

export interface AgentContactHandlesByChannel {
    agent: string;
    channel: ChannelTypes;
    startInterval?: Date;
    endInterval?: Date;
    contactsHandled?: number
}
