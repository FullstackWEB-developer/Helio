import { CancellationReasonTypes } from "@pages/external-access/models/cancellation-reason-types.enum";

export interface CancellationReasonExtended {
    description?: string;
    existsOnEMR: boolean;
    id: string;
    intentName?: string;
    isDefault: boolean;
    isMapped: boolean;
    name: string;
    nameOnEMR?: string;
    type?: CancellationReasonTypes,
    createdByName: string,
    createdOn: Date,
    modifiedByName: string,
    modifiedOn?: Date
}