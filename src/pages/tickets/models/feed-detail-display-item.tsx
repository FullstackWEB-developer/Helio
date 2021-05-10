import {FeedTypes} from '@pages/tickets/models/ticket-feed';

export interface FeedDetailDisplayItem {
    createdBy?: string,
    title?: string,
    feedType?: FeedTypes,
    dateTime?: Date,
    feedText?: string
}
