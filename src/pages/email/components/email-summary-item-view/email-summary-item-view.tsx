import {TicketMessageSummary} from '@shared/models';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {useQuery, useQueryClient} from 'react-query';
import {GetPatientPhoto, QueryTicketMessagesInfinite} from '@constants/react-query-constants';
import {getPatientPhoto} from '@pages/patients/services/patients.service';
import dayjs from 'dayjs';
import Avatar from '@components/avatar';
import classnames from 'classnames';
import SvgIcon, {Icon} from '@components/svg-icon';
import HighlighterText from '@components/highlighter-text/highlighter-text';
import Badge from '@components/badge';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import './email-summary-item-view.scss';
import {EmailPath} from '@app/paths';
import {useHistory, useParams} from 'react-router';
import ElipsisTooltipTextbox from '@components/elipsis-tooltip-textbox/elipsis-tooltip-textbox';
export interface EmailSummaryItemViewProps {
    emailInfo : TicketMessageSummary,
    searchTerm? : string;
}
dayjs.extend(utc);
dayjs.extend(isToday);
const EmailSummaryItemView = ({emailInfo, searchTerm}: EmailSummaryItemViewProps) => {
    const {createdForName, patientId, messageCreatedOn, messageSummary, unreadCount, createdForEndpoint, ticketId, hasAttachment} = emailInfo;
    const isRead = unreadCount === 0;
    const {t} = useTranslation();
    const urlParams = useParams<{ticketId?: string}>();
    const history = useHistory();
    const queryClient = useQueryClient();
    const {data: patientPhoto} = useQuery([GetPatientPhoto, patientId], () => getPatientPhoto(patientId!), {
        enabled: !!patientId
    });

    const getDate = () => {
        let date = dayjs.utc(messageCreatedOn).local();
        if (date.isToday()) {
            return date.format('hh:mm A');
        } else if (date.year() === dayjs().year()) {
            return date.format('MMM D');
        } else {
            return date.format('MMM D, YYYY');
        }
    }


    const userImage = useMemo(() => {
        if (createdForName) {
            if (patientPhoto && patientPhoto.length > 0) {
                return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                    src={`data:image/jpeg;base64,${patientPhoto}`} />
            }
            const avatarClassName = classnames('w-10 h-10', {
                'avatar-patient': !!emailInfo.patientId,
                'avatar-contact': !!emailInfo.contactId,
            });
            return <Avatar className={avatarClassName} userFullName={createdForName} />
        } else {
            return <Avatar icon={Icon.UserUnknown} />
        }
    }, [createdForName, emailInfo.contactId, emailInfo.patientId, patientPhoto, t]);

    const cleanEmailQueryCache = () => {
        queryClient.removeQueries(QueryTicketMessagesInfinite);
    }
    const itemClicked = () => {
        cleanEmailQueryCache();
        history.push(`${EmailPath}/${ticketId}`);
    }

    return (<div data-testid="email-summary-item-view" className={classnames('border-b email-summary cursor-pointer pl-6 pt-4 pb-1.5 flex', {'email-summary-selected': urlParams?.ticketId === ticketId})} onClick={() => itemClicked()} >
        <div className='flex flex-row w-full'>
            <div className='pr-4'>
                {userImage}
            </div>
            <div className='flex flex-col pr-6'>
                <div className='flex flex-row items-center'>
                    <div className='body1 truncate w-44'>
                        <HighlighterText text={createdForName ? createdForName : createdForEndpoint} highlighterText={searchTerm} />
                    </div>
                    <div className='body3-small w-20 justify-end flex flex-row'>
                        {hasAttachment && <div className='pr-2'><SvgIcon type={Icon.Attachment} className='icon-small' fillClass='rgba-06-fill' /></div>}
                        <ElipsisTooltipTextbox value={getDate()} classNames={"truncate"} asSpan={true} isDefaultTextClass={false} />
                    </div>
                </div>
                <div className='flex flex-row'>
                    <div className={classnames('w-44 email-summary-display', {'body3-medium': isRead, 'body3-big': !isRead})}>
                        <HighlighterText text={messageSummary} highlighterText={searchTerm} />
                    </div>
                    {!isRead &&
                        <div className='justify-end flex flex-row w-20'>
                            <div className='w-min pt-1'>
                                <Badge text={unreadCount?.toString()} type={'danger'} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>);
}

export default EmailSummaryItemView;
