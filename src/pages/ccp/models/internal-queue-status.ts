import {User} from '@shared/models';
import {QuickConnectInfo} from '@pages/ccp/models/quick-connect-info.model';

export interface InternalQueueStatus {
    queueType: string;
    queueArn: string;
    queueName: string;
    userId: string;
    connectStatus: string;
    forwardingEnabled: string;
    user?: User;
    displayName: string;
    quickConnectEndPoint: QuickConnectInfo
}
