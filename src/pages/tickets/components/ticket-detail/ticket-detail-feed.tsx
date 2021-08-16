import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {Ticket} from '../../models/ticket';
import {FeedDetailDisplayItem} from '../../models/feed-detail-display-item';
import FeedDetailItem from './feed-detail-item';
import {setFeedLastMessageOn} from '../../store/tickets.slice';
import {FeedTypes} from '../../models/ticket-feed';
import './ticket-detail-feed.scss';
import {selectUserList} from '@shared/store/lookups/lookups.selectors';
import {User} from '@shared/models/user';
import utils from '@shared/utils/utils';
import {useQuery} from 'react-query';
import {QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {getMessages} from '@pages/sms/services/ticket-messages.service';
import {ChannelTypes} from '@shared/models';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import Spinner from '@components/spinner/Spinner';

interface TicketDetailFeedProps {
    ticket: Ticket
}

const TicketDetailFeed = ({ticket}: TicketDetailFeedProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const [feeds, setFeeds] = useState<FeedDetailDisplayItem[]>([]);
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(true);
    const getTime = (date?: Date) => {
        return date != null ? new Date(date).getTime() : 0;
    }

    const {
        data: smsMessages,
        isLoading: smsLoading
    } = useQuery([QueryTicketMessagesInfinite, ChannelTypes.SMS, ticket.id], () => getMessages(ticket.id!, ChannelTypes.SMS, {
        page: 1,
        pageSize: 50
    }));
    const {
        data: emailMessages,
        isLoading: emailLoading
    } = useQuery([QueryTicketMessagesInfinite, ChannelTypes.Email, ticket.id], () => getMessages(ticket.id!, ChannelTypes.Email, {
        page: 1,
        pageSize: 50
    }));

    const getUser = (id: string | undefined): User | undefined => !!id ? users.find(user => user.id === id) : undefined;

    const getUsername = (user: User | undefined) => {
        return utils.stringJoin(' ', user?.firstName, user?.lastName)
    }

    useEffect(() => {
        if (smsLoading || emailLoading) {
            return;
        }
        const feedItems: FeedDetailDisplayItem[] = [];
        ticket.notes?.forEach(note => {
            const user = getUser(note.createdBy);
            feedItems.push({
                userFullName: getUsername(user),
                userPicture: user?.profilePicture,
                dateTime: note.createdOn,
                feedText: note.noteText,
                feedType: FeedTypes.Note
            });
        });
        ticket.feeds?.forEach(feed => {
            const user = getUser(feed.createdBy);
            feedItems.push({
                userFullName: getUsername(user),
                userPicture: user?.profilePicture,
                dateTime: feed.createdOn,
                feedType: feed.feedType,
                feedText: feed.description
            });
        });
        smsMessages?.results.forEach(message => {
            const user = getUser(message.createdBy);
            feedItems.push({
                userFullName: getUsername(user),
                userPicture: user?.profilePicture,
                dateTime: message.createdOn,
                feedType: FeedTypes.Sms,
                feedText: message.body
            });
        });

        emailMessages?.results.forEach(message => {
            const user = getUser(message.createdBy);
            feedItems.push({
                userFullName: getUsername(user),
                userPicture: user?.profilePicture,
                dateTime: message.createdOn,
                feedType: FeedTypes.Email,
                feedText: message.body
            });
        });
        if (feedItems.length > 0) {
            const sorted = feedItems.sort((a: FeedDetailDisplayItem, b: FeedDetailDisplayItem) => {
                return getTime(a.dateTime) - getTime(b.dateTime);
            });
            dispatch(setFeedLastMessageOn(sorted[sorted.length -1 ].dateTime as Date));
            setFeeds(feedItems);
        }
        setScrollToBottom(true);
        setTimeout(() => {
            setScrollToBottom(false);
        }, 300);

        return () => {
            dispatch(setFeedLastMessageOn());
        }
    }, [dispatch, ticket.feeds, ticket.notes, smsMessages, emailMessages, smsLoading, emailLoading]);

    if (emailLoading || smsLoading) {
        return <Spinner fullScreen/>
    }

    if (feeds?.length < 1) {
        return <div className='p-4 h7'
                    data-test-id='ticket-detail-feed-not-found'>{t('ticket_detail.feed.not_found')}</div>
    }

    return <div>
        <div className='pt-5 pb-1 h7 pl-20'>
            {t('ticket_detail.feed.title')}
        </div>
        <div className={'overflow-y-auto h-full-minus-33'}>
            {
                feeds.map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index}
                                                                                      item={feedItem}/>)
            }
            <AlwaysScrollToBottom enabled={scrollToBottom}/>
        </div>
    </div>
};

export default TicketDetailFeed;
