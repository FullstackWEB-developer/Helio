import SvgIcon, {Icon} from '@components/svg-icon';
import {CommunicationDirection, PhoneCallActivity} from '@shared/models';
import utils from '@shared/utils/utils';
import linkifyHtml from 'linkifyjs/html';
import { FeedDetailDisplayItem } from '@pages/tickets/models/feed-detail-display-item';
import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useDispatch } from 'react-redux';
import { toggleCallLogPlayerVisible } from '@pages/tickets/store/tickets.slice';
import { useTranslation } from 'react-i18next';

interface FeedDetailPhoneCallActivityProps {
    message?: PhoneCallActivity,
    feed: FeedDetailDisplayItem,
}
const FeedDetailPhoneCallActivity = ({message, feed}: FeedDetailPhoneCallActivityProps) => {
    const {t} = useTranslation();
    const dispatch = useDispatch();
    dayjs.extend(updateLocale);
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';

    dayjs.updateLocale('en', {
        relativeTime: {
            future: "in %s",
            past: "%s ago",
            s: 'a few seconds',
            m: "1 min",
            mm: "%d mins",
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

    const getCallDirectionText = (communicationDirection: CommunicationDirection) => {
        return communicationDirection === CommunicationDirection.Inbound ? t('ticket_detail.feed.inbound') : t('ticket_detail.feed.outbound') 
    }

    const getDuration = (duration: number | undefined) => {
        if(duration)
        {
            return (" (" + dayjs.duration(duration, 'seconds')
                .format(getFormat())
                .replace(getRegex(t('ticket_detail.feed.seconds')), '')
                .replace(getRegex(t('ticket_detail.feed.minutes')), '')
                .replace(getRegex(t('ticket_detail.feed.hours')), '')
                .trim() + ")")
        }else{
            return ""
        }
    }

    const getRegex = (type) => {
        return new RegExp(`\\b0 ${type}\\b`);
    }

    const getFormat = () => {
        return "H[ " + t('ticket_detail.feed.hours') + "] m[ " + t('ticket_detail.feed.minutes') + "] s[ " + t('ticket_detail.feed.seconds') + "]"
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
                        {message?.callDirection && <p className='body2' dangerouslySetInnerHTML={{__html: linkifyHtml(getCallDirectionText(message.callDirection) + (message?.callDuration && getDuration(message?.callDuration)))}}/>}
                        <div className='pt-3 flex flex-row space-x-2'>
                            {Icon.Phone && <div>
                                <SvgIcon type={Icon.Phone} className='icon-small' fillClass='rgba-038-fill'/>
                            </div>}
                            <span className='body3-medium'>
                                {itemDateTime}
                            </span>
                        </div>
                    </div>
                    <div className='h-12 mt-2 rounded flex flex-row text-xl activity-box'>
                        <div className='w-12 h-12 rounded-l activity-icon-wrapper justify-center items-center flex'>
                            <SvgIcon className='icon-medium' type={Icon.Phone} />
                        </div>
                        <div className='w-44 h-12 p-2'>
                            <div className='h-4 rounded flex flex-row text-xl'>
                                <div className='subtitle3'>{feed.userFullName ?? ''}</div>
                            </div>
                            <div className='h-4 rounded flex flex-row text-xl'>
                                <div className='caption-caps'>{message?.callDuration && utils.formatTime(message?.callDuration)}</div>
                            </div>
                        </div>
                        <div className='w-12 h-12 rounded-r justify-center items-center flex cursor-pointer'>
                            <SvgIcon className='icon-medium' type={Icon.View} disabled={!message?.canListenAnyRecording} onClick={() => dispatch(toggleCallLogPlayerVisible())} />
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default FeedDetailPhoneCallActivity;
