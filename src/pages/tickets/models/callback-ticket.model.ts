import {ChannelTypes} from "@shared/models";

export interface CallbackTicket {
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    mobileNumber: string;
    zip: string;
    note: string;
    subject: string;
    channel: ChannelTypes;
}
