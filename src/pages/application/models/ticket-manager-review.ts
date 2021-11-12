import {ChannelTypes} from '@shared/models';

export interface TicketManagerReview {
    id: string;
    ticketId: string;
    ticketNumber: number;
    ticketChannel: ChannelTypes,
    rating: number;
    feedback: string;
    createdByName: string;
    createdBy: string;
    createdOn: Date;

}
