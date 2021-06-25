import {UserStatusUpdateActivity} from '@shared/models/user-status-update-activity.model';

export interface AgentStatus {
    id: string;
    firstName: string;
    lastName: string;
    latestConnectStatus: string;
    timestamp: Date;
    activities: UserStatusUpdateActivity[];
}
