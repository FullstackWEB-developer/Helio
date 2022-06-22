import { CancellationReasonTypes } from "@pages/external-access/models/cancellation-reason-types.enum";

export interface CancellationReasonSaveRequest {
    id: number;
    name: string;
    intentName: string;
    description: string;
    type?: CancellationReasonTypes;
}