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
import {ChannelTypes, Contact, EmailMessageDto, PagedList, TicketMessage, TicketMessagesDirection} from '@shared/models';
import AlwaysScrollToBottom from '@components/scroll-to-bottom';
import Spinner from '@components/spinner/Spinner';
import {getUserList} from '@shared/services/lookups.service';
import DropdownLabel from '@components/dropdown-label';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { selectAppUserDetails } from '@shared/store/app-user/appuser.selectors';
import useCheckPermission from '@shared/hooks/useCheckPermission';
import { ContactType } from '@pages/contacts/models/ContactType';
import Checkbox from '@components/checkbox/checkbox';

export enum FeedFilter {
    AllActivity = 'ALL_ACTIVITY',
    InternalNotes = 'INTERNAL_NOTES'
}

interface TicketDetailFeedProps {
    ticket: Ticket,
    contact?: Contact;
}

const TicketDetailFeed = ({ticket, contact}: TicketDetailFeedProps) => {
    const {t} = useTranslation();
    dayjs.extend(utc);
    const dispatch = useDispatch();
    const users = useSelector(selectUserList);
    const [feeds, setFeeds] = useState<FeedDetailDisplayItem[]>([]);
    const [scrollToBottom, setScrollToBottom] = useState<boolean>(true);
    const [isOnlyThisTicket, setIsOnlyThisTicket] = useState<boolean>(false);
    const [selectedFeedFilter, setSelectedFeedFilter] = useState<FeedFilter>(FeedFilter.AllActivity);
    const [hasAnyFeed, setHasAnyFeed] = useState<boolean>(false);
    const {email} = useSelector(selectAppUserDetails);
    const hasListenAnyRecordingPermission = useCheckPermission('Tickets.ListenAnyRecording');
    const hasViewAnyTranscriptPermission = useCheckPermission('Tickets.ViewAnyChatTranscript');
    const getTime = (date?: Date) => {
        return date ? dayjs.utc(date).toDate().getTime() :  0;
    }

    useEffect(() => {
        dispatch(getUserList());
    }, [dispatch]);

    const getUser = (id: string | undefined): User | undefined => !!id ? users.find(user => user.id === id) : undefined;
    const getUserByEmail = (email: string | undefined): User | undefined => !!email ? users.find(user => user.email === email) : undefined;

    const getUsername = (user: User | undefined) => {
        return utils.stringJoin(' ', user?.firstName, user?.lastName)
    }

    const getContactUsername = () => {
        if(contact){
            if(contact.type === ContactType.Individual){
                return utils.stringJoin(' ', contact?.firstName, contact?.lastName)
            }else if(contact.type === ContactType.Company){
                return contact.companyName
            }
        }else{
            return ticket.createdForName
        }
    }

    useEffect(() => {
        let feedItems: FeedDetailDisplayItem[] = [];
        ticket.notes?.forEach(note => {
            if(isOnlyThisTicket && Number(note.belongsToTicket) !== ticket.ticketNumber){
                return;
            }
            const user = getUser(note.createdBy);
            feedItems.push({
                isRelatedTicketFeed: note.belongsToTicket === ticket.ticketNumber,
                belongsToTicket: note.belongsToTicket,
                userFullName: getUsername(user),
                userPicture: user?.profilePicture,
                createdOn: note.createdOn,
                description: note.noteText,
                feedType: FeedTypes.Note,
            });
        });

        if (selectedFeedFilter === FeedFilter.AllActivity) {
            ticket.feeds?.forEach(feed => {
                if(isOnlyThisTicket && Number(feed.belongsToTicket) !== ticket.ticketNumber){
                    return;
                }
                const user = getUser(feed.createdBy);
                if(feed.feedType === FeedTypes.Sms){
                    feedItems.push({
                        isRelatedTicketFeed: Number(feed.belongsToTicket) === ticket.ticketNumber || Number(feed.belongsToTicket) === 0,
                        belongsToTicket: feed.belongsToTicket,
                        userFullName: getUsername(user),
                        userPicture: user?.profilePicture,
                        createdOn: feed.createdOn,
                        feedType: feed.feedType,
                        description: feed.ticketMessage?.body
                    });
                }else if(feed.feedType === FeedTypes.PhoneCall){
                    const user = getUserByEmail(ticket.contactAgent);
                    feedItems.push({
                        belongsToTicketId: feed.belongsToTicketId,
                        isRelatedTicketFeed: Number(feed.belongsToTicket) === ticket.ticketNumber || Number(feed.belongsToTicket) === 0,
                        belongsToTicket: feed.belongsToTicket,
                        userFullName: getContactUsername(),
                        userPicture: user?.profilePicture,
                        createdOn: feed.createdOn,
                        feedType: feed.feedType,
                        description: feed.ticketMessage?.body,
                        communicationDirection: feed.communicationDirection,
                        canListenAnyRecording: !!ticket.connectEvents?.find(a => a.userEmail === email && a.belongsToTicket === Number(feed.belongsToTicket)) || hasListenAnyRecordingPermission,
                        callDuration: feed.callDuration,
                        voiceLink: feed.voiceLink
                    });
                }else if(feed.feedType === FeedTypes.ChatActiviy){
                    const user = getUserByEmail(ticket.contactAgent);
                    feedItems.push({
                        belongsToTicketId: feed.belongsToTicketId,
                        isRelatedTicketFeed: Number(feed.belongsToTicket) === ticket.ticketNumber || Number(feed.belongsToTicket) === 0,
                        belongsToTicket: feed.belongsToTicket,
                        userFullName: getContactUsername(),
                        userPicture: user?.profilePicture,
                        createdOn: feed.createdOn,
                        feedType: feed.feedType,
                        description: feed.ticketMessage?.body,
                        canViewAnyTranscript: !!ticket.connectEvents?.find(a => a.userEmail === email && a.belongsToTicket === Number(feed.belongsToTicket))  || hasViewAnyTranscriptPermission,
                    });
                }else if(feed.feedType === FeedTypes.Email){
                    const user = getUser(feed.ticketMessage?.createdBy);
                    feedItems.push({
                        belongsToTicketId: feed.belongsToTicketId,
                        isRelatedTicketFeed: Number(feed.belongsToTicket) === ticket.ticketNumber || Number(feed.belongsToTicket) === 0,
                        belongsToTicket: feed.belongsToTicket,
                        userFullName: feed.ticketMessage?.direction === TicketMessagesDirection.Incoming ? getContactUsername() : getUsername(user),
                        userPicture: user?.profilePicture,
                        createdOn: feed.createdOn,
                        feedType: feed.feedType,
                        description: feed.ticketMessage?.body,
                        ticketMessage: feed.ticketMessage
                    });
                }else{
                    feedItems.push({
                        isRelatedTicketFeed: Number(feed.belongsToTicket) === ticket.ticketNumber || Number(feed.belongsToTicket) === 0,
                        belongsToTicket: feed.belongsToTicket,
                        userFullName: getUsername(user),
                        userPicture: user?.profilePicture,
                        createdOn: feed.createdOn,
                        feedType: feed.feedType,
                        description: feed.description,
                        callDuration: feed.callDuration,
                        chatLink: feed.chatLink,
                        communicationDirection: feed.communicationDirection,
                        createdBy: feed.createdBy,
                        voiceLink: feed.voiceLink
                    });
                }
            });
        }

        const hasAnyFeed = ticket?.feeds && ticket.feeds.length > 0 || ticket?.notes && ticket.notes.length > 0;
        setHasAnyFeed(hasAnyFeed || false);

        if (feedItems.length > 0) {
            const sorted = feedItems.sort((a: FeedDetailDisplayItem, b: FeedDetailDisplayItem) => {
                return getTime(b.createdOn) - getTime(a.createdOn);
            });
            dispatch(setFeedLastMessageOn(sorted[0].createdOn as Date));
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
    }, [dispatch, ticket.feeds, ticket.notes, selectedFeedFilter, isOnlyThisTicket, contact]);

    return <div>
        <div className='flex flex-row justify-between items-center pr-6 pt-6'>
            <div className='pb-1 h7 pl-20'>
                {t('ticket_detail.feed.title')}
            </div>
            <div className='flex flex-row'>
                {
                    (ticket.feeds && ticket.feeds?.filter(x => x.belongsToTicket !== ticket.ticketNumber).length > 0 ||
                    ticket.notes && ticket.notes?.filter(x => x.belongsToTicket !== ticket.ticketNumber).length > 0) &&
                        <div className='mr-8'>
                            <Checkbox name='isOnylThisTicket' labelClassName='body2' data-testid='isOnylThisTicket' checked={isOnlyThisTicket} onChange={(event) => setIsOnlyThisTicket(event.checked)} label='ticket_detail.feed.only_this_ticket' />
                        </div>
                }
                <div>
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
            </div>
        </div>
        <AlwaysScrollToBottom enabled={scrollToBottom}/>
        <div className={'overflow-y-auto h-full-minus-34'}>
            {feeds?.length < 1 && !hasAnyFeed &&
                <div className='pt-4 h7 pl-20 body2' data-test-id='ticket-detail-feed-not-found'>{t('ticket_detail.feed.not_found')}</div>
            }
            {
                feeds.map((feedItem: FeedDetailDisplayItem, index) => <FeedDetailItem key={index} index={index} feed={feedItem}/>)
            }
        </div>
    </div>
};

export default TicketDetailFeed;
