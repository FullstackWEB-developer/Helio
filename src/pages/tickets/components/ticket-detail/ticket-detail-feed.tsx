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
import {ChannelTypes, TicketMessagesDirection} from '@shared/models';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import Spinner from '@components/spinner/Spinner';
import {getUserList} from '@shared/services/lookups.service';
import DropdownLabel from '@components/dropdown-label';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export enum FeedFilter {
    AllActivity = 'ALL_ACTIVITY',
    InternalNotes = 'INTERNAL_NOTES'
}

interface TicketDetailFeedProps {
    ticket: Ticket
}

const TicketDetailFeed = ({ticket}: TicketDetailFeedProps) => {
    const {t} = useTranslation();
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const [feeds, setFeeds] = useState<FeedDetailDisplayItem[]>([]);
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(true);
    const [selectedFeedFilter, setSelectedFeedFilter] = useState<FeedFilter>(FeedFilter.AllActivity);
    const [hasAnyFeed, setHasAnyFeed] = useState<boolean>(false);
    const getTime = (date?: Date) => {
        return date ? dayjs.utc(date).toDate().getTime() :  0;
    }

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

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
                feedType: FeedTypes.Note,
                item: note
            });
        });
        if (selectedFeedFilter === FeedFilter.AllActivity) {
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
                    userFullName: message.direction === TicketMessagesDirection.Incoming ? ticket.createdForName : getUsername(user),
                    userPicture: user?.profilePicture,
                    dateTime: message.createdOn,
                    feedType: FeedTypes.Sms,
                    feedText: message.body,
                    item: message
                });
            });

            emailMessages?.results.forEach(message => {
                const user = getUser(message.createdBy);
                feedItems.push({
                    userFullName: getUsername(user),
                    userPicture: user?.profilePicture,
                    dateTime: message.createdOn,
                    feedType: FeedTypes.Email,
                    feedText: message.body,
                    item: message
                });
            });
        }
        const hasAnyFeed = emailMessages?.results && emailMessages.results.length > 0 ||
            smsMessages?.results && smsMessages.results.length > 0 ||
            ticket?.feeds && ticket.feeds.length > 0 ||
            ticket?.notes && ticket.notes.length > 0;
        setHasAnyFeed(hasAnyFeed || false);

        if (feedItems.length > 0) {
            console.log("NonSorted" + JSON.stringify(feedItems));
            const sorted = feedItems.sort((a: FeedDetailDisplayItem, b: FeedDetailDisplayItem) => {
                return getTime(b.dateTime) - getTime(a.dateTime);
            });
            dispatch(setFeedLastMessageOn(sorted[0].dateTime as Date));
            console.log("Sorted" + JSON.stringify(sorted));
            setFeeds(sorted);
        } else {
            setFeeds([]);
        }
        setScrollToBottom(true);
        setTimeout(() => {
            setScrollToBottom(false);
        }, 300);

        return () => {
            dispatch(setFeedLastMessageOn());
        }
    }, [dispatch, ticket.feeds, ticket.notes, smsMessages, emailMessages, selectedFeedFilter]);

    if (emailLoading || smsLoading) {
        return <Spinner fullScreen/>
    }

    if (feeds?.length < 1 && !hasAnyFeed) {
        return <div className='p-4 h7'
                    data-test-id='ticket-detail-feed-not-found'>{t('ticket_detail.feed.not_found')}</div>
    }

    return <div>
        <div className='flex flex-row justify-between items-center pr-6 pt-6'>
            <div className='pb-1 h7 pl-20'>
                {t('ticket_detail.feed.title')}
            </div>
            <DropdownLabel
                items={[
                    {label: 'ticket_detail.feed.all_activity', value: FeedFilter.AllActivity, object: FeedFilter.AllActivity},
                    {label: 'ticket_detail.feed.internal_notes', value: FeedFilter.InternalNotes, object: FeedFilter.InternalNotes}
                ]}
                labelClassName='body2'
                value={selectedFeedFilter}
                onClick={(item) => setSelectedFeedFilter(item.object)}
            />
        </div>
        <AlwaysScrollToBottom enabled={scrollToBottom}/>
        <div className={'overflow-y-auto h-full-minus-33'}>
            {
                feeds.map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index}
                                                                                      index={index}
                                                                                      feed={feedItem}/>)
            }
        </div>
    </div>
};

export default TicketDetailFeed;
