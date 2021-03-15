import React, {Fragment, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { Ticket } from '../../models/ticket';
import { FeedDetailDisplayItem } from '../../models/feed-detail-display-item';
import FeedDetailItem from './feed-detail-item';
import { selectEnumValues } from '../../store/tickets.selectors';
import { getEnumByType } from '../../services/tickets.service';
import { TicketFeed } from '../../models/ticket-feed';

interface TicketDetailFeedProps {
    ticket: Ticket
}

const TicketDetailFeed = ({ticket}: TicketDetailFeedProps) => {
    const dispatch = useDispatch();
    const feedTypes = useSelector((state => selectEnumValues(state, 'FeedType')));

    const notes = ticket?.notes;
    const feeds = ticket?.feeds;
    let feedItems: FeedDetailDisplayItem[] = [];

    useEffect(() => {
        dispatch(getEnumByType('FeedType'));
    }, [dispatch]);

    const getFeedType = (feed: TicketFeed) => {
        return feedTypes.find(f => f.key === feed.feedType)?.value;
    }

    notes?.forEach(note => {
        feedItems.push({
            createdBy: note.createdBy,
            dateTime: note.createdOn,
            feedText: note.noteText
        });
    });

    feeds?.forEach(feed => {
        feedItems.push({
            createdBy: feed.createdBy,
            dateTime: feed.createdOn,
            feedType: getFeedType(feed),
            feedText: feed.description
        });
    });

    return <Fragment>
            {
                feedItems.map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index} item={feedItem} />)
            }
        </Fragment>
};

export default withErrorLogging(TicketDetailFeed);
