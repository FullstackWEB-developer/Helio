import {User} from '@shared/models';

export interface InternalQueueStatus {
    queueType: string;
    queueArn: string;
    queueName: string;
    userId: string;
    connectStatus: string;
    forwardingEnabled: string;
    user?: User;
    displayName: string;
}
