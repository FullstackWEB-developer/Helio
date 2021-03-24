import React, {Fragment, useCallback, useEffect, useMemo, useRef} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import { useTranslation } from 'react-i18next';
import { Ticket } from '../../models/ticket';
import { FeedDetailDisplayItem } from '../../models/feed-detail-display-item';
import FeedDetailItem from './feed-detail-item';
import { getEnumByType } from '../../services/tickets.service';
import { setFeedLastMessageOn } from '../../store/tickets.slice';
import {
    selectEnumValues,
    selectIsRequestAddNoteLoading,
    selectIsRequestAddFeedLoading
} from '../../store/tickets.selectors';
import { TicketFeed } from '../../models/ticket-feed';
import ThreeDots from '../../../../shared/components/skeleton-loader/skeleton-loader';

interface TicketDetailFeedProps {
    ticket: Ticket
}

const TicketDetailFeed = ({ticket}: TicketDetailFeedProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();

    const isRequestAddNoteLoading = useSelector(selectIsRequestAddNoteLoading);
    const isRequestAddFeedLoading = useSelector(selectIsRequestAddFeedLoading);
    const feedTypes = useRef(useSelector((state => selectEnumValues(state, 'FeedType'))));

    const notes = ticket?.notes;
    const feeds = ticket?.feeds;
    const feedItems: FeedDetailDisplayItem[] = useMemo(() => [], []);

    const getFeedType = useCallback((feed: TicketFeed) => {
        return feedTypes.current.find(f => f.key === feed.feedType)?.value;
    }, []);

    const sortByDate = useCallback((feedItems: FeedDetailDisplayItem[]): FeedDetailDisplayItem[] => {
        return feedItems.sort((a: FeedDetailDisplayItem, b: FeedDetailDisplayItem) => {
            return getTime(b.dateTime) - getTime(a.dateTime);
        });
    }, []);

    useEffect(() => {
        dispatch(getEnumByType('FeedType'));
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
        feedItems.length = 0;
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
        if (feedItems.length > 0) {
            dispatch(setFeedLastMessageOn(sortByDate(feedItems)[0].dateTime as Date));
        }
    }, [dispatch, getFeedType, sortByDate, feeds, notes, feedItems]);

    const getTime = (date?: Date) => {
        return date != null ? new Date(date).getTime() : 0;
    }

    if (isRequestAddFeedLoading || isRequestAddNoteLoading) {
        return <ThreeDots data-test-id='ticket-detail-loading' />;
    }

    if (feedItems?.length < 1) {
        return <div className='p-4 h7' data-test-id='ticket-detail-feed-not-found'>{t('ticket_detail.feed.not_found')}</div>
    }

    return <Fragment>
            {
                sortByDate(feedItems).map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index} item={feedItem} />)
            }
        </Fragment>
};

export default withErrorLogging(TicketDetailFeed);
