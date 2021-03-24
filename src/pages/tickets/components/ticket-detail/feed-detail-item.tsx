import { FeedDetailDisplayItem } from '../../models/feed-detail-display-item';
import Avatar from '../../../../shared/components/avatar/avatar';
import React from 'react';
import dayjs from 'dayjs';
import withErrorLogging from '../../../../shared/HOC/with-error-logging';
import utils from '../../../../shared/utils/utils';

interface FeedDetailItemProps {
    item: FeedDetailDisplayItem
}

const FeedDetailItem = ({ item }: FeedDetailItemProps) => {
    const formatTemplate = 'ddd, MMM DD, YYYY h:mm a';
    const itemDateTime = item.dateTime ? `${dayjs().to(dayjs(item.dateTime))} (${dayjs(item.dateTime).format(formatTemplate)})` : '';
    return (
        <div className={'flex flex-row p-8'}>
            <div className='w-8 h-8'>
                <Avatar
                    model={{
                        initials: utils.getInitialsFromFullName(item.createdBy || '')
                    }}
                />
            </div>
            <div className={'pl-8'}>
                <div className={'flex flex-row'}>
                    <h6>{item.createdBy} {item.title}</h6>
                    <span className={'pl-2'}>{item.feedType}</span>
                </div>
                <div className={'pt-2 flex flex-col text-xl'}>
                    <span className='body'>
                        { itemDateTime }
                    </span>
                    <p className='pt-6'>{item.feedText}</p>
                </div>
            </div>
        </div>
    );
}

export default withErrorLogging(FeedDetailItem);
