import {UserStatusUpdateActivity} from '@shared/models/user-status-update-activity.model';

export interface UserStatusUpdate {
    userId: string;
    status: string;
    timestamp: Date;
    activities?: UserStatusUpdateActivity[];
}

