import {FeedDetailDisplayItem} from '../../models/feed-detail-display-item';
import Avatar from '../../../../shared/components/avatar/avatar';
import React from 'react';
import dayjs from 'dayjs';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import utils from '../../../../shared/utils/utils';
import {useTranslation} from 'react-i18next';

interface FeedDetailItemProps {
    item: FeedDetailDisplayItem
}

const FeedDetailItem = ({item}: FeedDetailItemProps) => {
    const {t} = useTranslation();
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';
    const itemDateTime = item.dateTime ? `${dayjs().to(dayjs.utc(item.dateTime).local())} (${utils.formatUtcDate(item.dateTime, formatTemplate)})` : '';
    return (
        <div className={'flex flex-row pl-6 py-4 border-b'}>
            <div className='w-8 h-8 pt-2'>
                <Avatar userFullName={item.userFullName ?? ''} userPicture={item.userPicture} />
            </div>
            <div className='pl-6'>
                <div className='flex flex-row'>
                    <div className='subtitle2'>{item.userFullName} {item.title}</div>
                    {item.feedType &&
                        <span className='pl-1 body2'>{t(`ticket_detail.feed.feed_type_${item.feedType}`)}</span>}
                </div>
                <div className='pt-1 flex flex-col text-xl'>
                    <span className='body3-medium'>
                        {itemDateTime}
                    </span>
                    <p className='pt-3 body2'>{item.feedText}</p>
                </div>
            </div>
        </div>
    );
}

export default withErrorLogging(FeedDetailItem);
