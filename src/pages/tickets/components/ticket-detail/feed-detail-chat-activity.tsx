import SvgIcon, {Icon} from '@components/svg-icon';
import {ChatActivity} from '@shared/models';
import utils from '@shared/utils/utils';
import { FeedDetailDisplayItem } from '@pages/tickets/models/feed-detail-display-item';
import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useDispatch } from 'react-redux';
import { toggleChatTranscriptWindowVisible } from '@pages/tickets/store/tickets.slice';
import {DAYJS_LOCALE} from '@pages/email/constants';

interface FeedDetailChatActivityProps {
    message?: ChatActivity,
    feed: FeedDetailDisplayItem,
}
const FeedDetailChatActivity = ({message, feed}: FeedDetailChatActivityProps) => {
    const dispatch = useDispatch();
    dayjs.extend(updateLocale);
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';

    dayjs.updateLocale('en', DAYJS_LOCALE);
    const itemDateTime = feed.dateTime ? `${dayjs().to(dayjs.utc(feed.dateTime).local())} (${utils.formatUtcDate(feed.dateTime, formatTemplate)})` : '';

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
                            {Icon.Chat && <div>
                                <SvgIcon type={Icon.Chat} className='icon-small' fillClass='rgba-038-fill'/>
                            </div>}
                            <span className='body3-medium'>
                                {itemDateTime}
                            </span>
                        </div>
                    </div>
                    <div className='h-12 mt-2 rounded flex flex-row text-xl activity-box'>
                        <div className='w-12 h-12 rounded-l activity-icon-wrapper justify-center items-center flex'>
                            <SvgIcon className='icon-medium' type={Icon.Chat} />
                        </div>
                        <div className='w-44 h-12 p-2 flex flex-row text-xl items-center'>
                            <div className='subtitle3 truncate'>{feed.userFullName ?? ''}</div>
                        </div>
                        <div className='w-12 h-12 rounded-r justify-center items-center flex cursor-pointer'>
                            <SvgIcon className='icon-medium' type={Icon.View} disabled={!message?.canViewAnyTranscript} onClick={() => dispatch(toggleChatTranscriptWindowVisible())} />
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default FeedDetailChatActivity;
