import {FeedTypes} from '@pages/tickets/models/ticket-feed';

export interface FeedDetailDisplayItem {
    userFullName?: string,
    userPicture?: string,
    title?: string,
    feedType?: FeedTypes,
    dateTime?: Date,
    feedText?: string
}
