import React, {useEffect, useMemo} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Ticket} from '../../models/ticket';
import {FeedDetailDisplayItem} from '../../models/feed-detail-display-item';
import FeedDetailItem from './feed-detail-item';
import {getEnumByType} from '../../services/tickets.service';
import {resetLastFeedMessageOn, setFeedLastMessageOn} from '../../store/tickets.slice';
import {FeedTypes} from '../../models/ticket-feed';
import './ticket-detail-feed.scss';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import utils from '@shared/utils/utils';
interface TicketDetailFeedProps {
    ticket: Ticket
}

const TicketDetailFeed = React.forwardRef<HTMLDivElement, TicketDetailFeedProps>(({ticket}, ref) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);

    const getTime = (date?: Date) => {
        return date != null ? new Date(date).getTime() : 0;
    }

    useEffect(() => {
        dispatch(resetLastFeedMessageOn());
        dispatch(getEnumByType('TicketPriority'));
        dispatch(getEnumByType('TicketStatus'));
        dispatch(getEnumByType('TicketType'));
    }, [dispatch, ticket]);

    const getUser = (id: string | undefined): User | undefined => !!id ? users.find(user => user.id === id) : undefined;

    const memoizedFeeds: FeedDetailDisplayItem[] = useMemo(() => {
        const feedItems: FeedDetailDisplayItem[] = [];
        ticket.notes?.forEach(note => {
            const user = getUser(note.createdBy);
            feedItems.push({
                userFullName: utils.stringJoin(' ', user?.firstName, user?.lastName),
                userPicture: user?.profilePicture,
                dateTime: note.createdOn,
                feedText: note.noteText,
                feedType: FeedTypes.Note
            });
        });
        ticket.feeds?.forEach(feed => {
            const user = getUser(feed.createdBy);
            feedItems.push({
                userFullName: utils.stringJoin(' ', user?.firstName, user?.lastName),
                userPicture: user?.profilePicture,
                dateTime: feed.createdOn,
                feedType: feed.feedType,
                feedText: feed.description
            });
        });
        if (feedItems.length > 0) {
            const sorted = feedItems.sort((a: FeedDetailDisplayItem, b: FeedDetailDisplayItem) => {
                return getTime(a.dateTime) - getTime(b.dateTime);
            });
            dispatch(setFeedLastMessageOn(sorted[0].dateTime as Date));
            return feedItems;
        }
        return [];
    }, [dispatch, ticket.feeds, ticket.notes]);


    if (memoizedFeeds?.length < 1) {
        return <div className='p-4 h7'
            data-test-id='ticket-detail-feed-not-found'>{t('ticket_detail.feed.not_found')}</div>
    }

    return <div>
        <div className='pt-5 pb-1 h7 pl-20'>
            {t('ticket_detail.feed.title')}
        </div>
        <div className={'overflow-y-auto h-full-minus-26'}>
            {
                memoizedFeeds.map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index}
                    item={feedItem} />)
            }
            <div ref={ref} />
        </div>
    </div>
});

export default TicketDetailFeed;
