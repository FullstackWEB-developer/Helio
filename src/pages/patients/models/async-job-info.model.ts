import {AsyncJobStatus} from '@pages/patients/models/async-job-status.enum';

export interface AsyncJobInfo {
    id: string;
    jobName: string;
    messageTime: Date;
    startTime: Date;
    endTime: Date;
    status: AsyncJobStatus;
    errorMessage: string;
}
