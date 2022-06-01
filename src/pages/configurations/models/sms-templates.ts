import { SMSDirection } from "@shared/models/sms-direction";

export interface SMSTemplate {
    id: string,
    name: string,
    direction: SMSDirection,
    description: string,
    templateBody: string,
    createdByName: string,
    modifiedByName: string,
    createdOn: Date,
    modifiedOn?: Date,
}