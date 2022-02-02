import {FeedDetailDisplayItem} from '../../models/feed-detail-display-item';
import Avatar from '../../../../shared/components/avatar/avatar';
import React from 'react';
import dayjs from 'dayjs';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import utils from '../../../../shared/utils/utils';
import {FeedTypes} from '@pages/tickets/models/ticket-feed';
import SvgIcon, {Icon} from '@components/svg-icon';
import updateLocale from 'dayjs/plugin/updateLocale';
import {EmailMessageDto} from '@shared/models';
import FeedDetailEmailItem from '@pages/tickets/components/ticket-detail/feed-detail-email-item';
import './feed-detail-item.scss';
interface FeedDetailItemProps {
    feed: FeedDetailDisplayItem,
    index: number;
}

const FeedDetailItem = ({feed, index}: FeedDetailItemProps) => {
    dayjs.extend(updateLocale);
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';

    dayjs.updateLocale('en', {
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            m: "1 m",
            mm: "%d m",
            h: "1 h",
            hh: "%d h",
            d: "1 d",
            dd: "%d d",
            M: "1 mo",
            MM: "%d mo",
            y: "1 y",
            yy: "%d y"
        }
    })
    const itemDateTime = feed.dateTime ? `${dayjs().to(dayjs.utc(feed.dateTime).local())} (${utils.formatUtcDate(feed.dateTime, formatTemplate)})` : '';
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
    }

    if (feed.feedType === FeedTypes.Email) {
        const email = feed.item as EmailMessageDto;
        return <FeedDetailEmailItem
            message= {email}
            key={email.id}
            isCollapsed={index > 0}
            feedTime={itemDateTime}
        />
    }

    return (
        <div className={'flex flex-row pl-6 py-4 border-b'}>
            <div className='w-8 h-8 pt-2'>
                <Avatar userFullName={feed.userFullName ?? ''} userPicture={feed.userPicture} />
            </div>
            <div className='pl-6'>
                <div className='flex flex-row'>
                    <div className='subtitle2'>{feed.userFullName} {feed.title}</div>
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
                    {feed.feedText && <p className='pt-3 body2' dangerouslySetInnerHTML={{__html: feed.feedText}}/>}
                </div>
            </div>
        </div>
    );
}

export default withErrorLogging(FeedDetailItem);
