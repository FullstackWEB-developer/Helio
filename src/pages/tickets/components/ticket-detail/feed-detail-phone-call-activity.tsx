import SvgIcon, {Icon} from '@components/svg-icon';
import {CommunicationDirection, PhoneCallActivity} from '@shared/models';
import utils from '@shared/utils/utils';
import linkifyHtml from 'linkifyjs/html';
import { FeedDetailDisplayItem } from '@pages/tickets/models/feed-detail-display-item';
import Avatar from '@components/avatar';
import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import { useDispatch } from 'react-redux';
import { setPlayVoiceTicketId } from '@pages/tickets/store/tickets.slice';
import { useTranslation } from 'react-i18next';
import {DAYJS_LOCALE} from '@pages/email/constants';
import { TicketsPath } from '@app/paths';
import { useHistory } from 'react-router';

interface FeedDetailPhoneCallActivityProps {
    message?: PhoneCallActivity,
    feed: FeedDetailDisplayItem,
}
const FeedDetailPhoneCallActivity = ({message, feed}: FeedDetailPhoneCallActivityProps) => {
    const {t} = useTranslation();
    const history = useHistory();
    const dispatch = useDispatch();
    dayjs.extend(updateLocale);
    const formatTemplate = 'ddd, MMM DD, YYYY [at] h:mm a';

    dayjs.updateLocale('en', DAYJS_LOCALE);
    const itemDateTime = feed.createdOn ? `${dayjs().to(dayjs.utc(feed.createdOn).local())} (${utils.formatUtcDate(feed.createdOn, formatTemplate)})` : '';

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
                        <div className='flex flex-row'>
                            {message?.callDirection && <p className='body2 mr-2' dangerouslySetInnerHTML={{__html: linkifyHtml(getCallDirectionText(message.callDirection) + (message?.callDuration && getDuration(message?.callDuration)))}}/>}
                            {
                                !feed.isRelatedTicketFeed && <div className='body2-primary cursor-pointer hover:underline' onClick={() => history.push(`${TicketsPath}/${feed.belongsToTicket}`)}>{feed.belongsToTicket}</div>
                            }
                        </div>
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
                                <div className='subtitle3 truncate'>{feed.userFullName ?? ''}</div>
                            </div>
                            <div className='h-4 rounded flex flex-row text-xl'>
                                <div className='caption-caps'>{message?.callDuration && utils.formatTime(message?.callDuration)}</div>
                            </div>
                        </div>
                        <div className='w-12 h-12 rounded-r justify-center items-center flex cursor-pointer'>
                            <SvgIcon className='icon-medium' type={Icon.View} disabled={!message?.canListenAnyRecording} onClick={() => dispatch(setPlayVoiceTicketId(feed.belongsToTicketId!))} />
                        </div>
                    </div>
                </div>
            </div>
    )
}

export default FeedDetailPhoneCallActivity;
