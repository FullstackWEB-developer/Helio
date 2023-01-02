import {FeedDetailDisplayItem} from '../../models/feed-detail-display-item';
import Avatar from '../../../../shared/components/avatar/avatar';
import React from 'react';
import dayjs from 'dayjs';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import utils from '../../../../shared/utils/utils';
import {FeedTypes} from '@pages/tickets/models/ticket-feed';
import SvgIcon, {Icon} from '@components/svg-icon';
import updateLocale from 'dayjs/plugin/updateLocale';
import {ChatActivity, EmailMessageDto, PhoneCallActivity} from '@shared/models';
import FeedDetailEmailItem from '@pages/tickets/components/ticket-detail/feed-detail-email-item';
import './feed-detail-item.scss';
import linkifyHtml from 'linkifyjs/html'
import FeedDetailPhoneCallActivity from './feed-detail-phone-call-activity';
import FeedDetailChatActivity from './feed-detail-chat-activity';
import {DAYJS_LOCALE} from '@pages/email/constants';
import { useHistory } from 'react-router';
import { TicketsPath } from '@app/paths';
import classname from 'classnames';
interface FeedDetailItemProps {
    feed: FeedDetailDisplayItem,
    index: number;
}

const FeedDetailItem = ({feed, index}: FeedDetailItemProps) => {
    dayjs.extend(updateLocale);
    const history = useHistory();
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';
    dayjs.updateLocale('en', DAYJS_LOCALE);
    const itemDateTime = feed.createdOn ? `${dayjs().to(dayjs.utc(feed.createdOn).local())} (${utils.formatUtcDate(feed.createdOn, formatTemplate)})` : '';
    let icon;
    switch (feed.feedType) {
        case FeedTypes.Note:
            icon = Icon.Note;
            break;
        case FeedTypes.Email:
            icon = Icon.Email;
            break;
        case FeedTypes.Sms:
            icon = Icon.Sms;
            break;
        case FeedTypes.StatusChange:
            icon = Icon.Scripts;
            break;
        case FeedTypes.PhoneCall:
            icon = Icon.Phone;
            break;
    }

    if (feed.feedType === FeedTypes.Email) {
        const email = feed.ticketMessage as EmailMessageDto;
        return <FeedDetailEmailItem
            userFullName={feed.userFullName}
            message= {email}
            key={email.id}
            isCollapsed={index > 0}
            feedTime={itemDateTime}
            belongsToTicket={feed.belongsToTicket}
            isRelatedTicketFeed={feed.isRelatedTicketFeed}
        />
    }

    if (feed.feedType === FeedTypes.PhoneCall) {
        const activity = {
            canListenAnyRecording: feed.canListenAnyRecording,
            callDirection: feed.communicationDirection,
            callDuration: feed.callDuration
        } as PhoneCallActivity;
        return(
            <FeedDetailPhoneCallActivity
                feed={feed}
                message={activity}/>
        );
    }

    if (feed.feedType === FeedTypes.ChatActiviy) {
        const activity = {
            canViewAnyTranscript: feed.canViewAnyTranscript
        } as ChatActivity;
        return(
            <FeedDetailChatActivity
                feed={feed}
                message={activity}/>
        );
    }

    return (
        <div className={'flex flex-row pl-6 py-4 border-b'}>
            <div className='w-8 h-8 pt-2'>
                <Avatar userFullName={feed.userFullName ?? ''} userPicture={feed.userPicture} />
            </div>
            <div className='pl-6'>
                <div className='flex flex-row gap-2'>
                    <div className='subtitle2'>{feed.userFullName} {feed.title}</div>
                    {
                      !feed.isRelatedTicketFeed && <div className='body2-primary cursor-pointer hover:underline' onClick={() => history.push(`${TicketsPath}/${feed.belongsToTicket}`)}>{feed.belongsToTicket}</div>
                    }
                </div>
                <div className='pt-1 flex flex-col text-xl'>
                    <div className='flex flex-row space-x-2'>
                        {icon && <div>
                            <SvgIcon type={icon} className='icon-small' fillClass='rgba-038-fill'/>
                        </div>}
                        <span className='body3-medium'>
                            {itemDateTime}
                        </span>
                    </div>
                    {feed.description && <p className='pt-3 body2 break-words pr-8' dangerouslySetInnerHTML={{__html: linkifyHtml(feed.description)}}/>}
                </div>
            </div>
        </div>
    );
}

export default withErrorLogging(FeedDetailItem);
