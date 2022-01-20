import {TicketMessageSummary} from '@shared/models';
import {useTranslation} from 'react-i18next';
import {useMemo} from 'react';
import {useQuery} from 'react-query';
import {GetPatientPhoto} from '@constants/react-query-constants';
import {getPatientPhoto} from '@pages/patients/services/patients.service';
import dayjs from 'dayjs';
import Avatar from '@components/avatar';
import classnames from 'classnames';
import {Icon} from '@components/svg-icon';
import HighlighterText from '@components/highlighter-text/highlighter-text';
import Badge from '@components/badge';
import isToday from 'dayjs/plugin/isToday';
import utc from 'dayjs/plugin/utc';
import './email-summary-item-view.scss';
import {EmailPath} from '@app/paths';
import {useHistory, useParams} from 'react-router';
export interface EmailSummaryItemViewProps {
    emailInfo : TicketMessageSummary,
    searchTerm? : string;
}
dayjs.extend(utc);
dayjs.extend(isToday);
const EmailSummaryItemView = ({emailInfo, searchTerm}: EmailSummaryItemViewProps) => {
    const {createdForName, patientId, messageCreatedOn, messageSummary, unreadCount, createdForEndpoint, ticketId} = emailInfo;
    const isRead = unreadCount === 0;
    const {t} = useTranslation();
    const urlParams = useParams<{ticketId?: string}>();
    const history = useHistory();
    const {data: patientPhoto} = useQuery([GetPatientPhoto, patientId], () => getPatientPhoto(patientId!), {
        enabled: !!patientId
    });

    const getDate = useMemo(() => {
        const messageSendAt = messageCreatedOn;
        if (dayjs(messageSendAt).isToday()) {
            return dayjs.utc(messageSendAt).local().format('hh:mm A');
        } else {
            return dayjs.utc(messageSendAt).local().format('MMM D');
        }
    }, [messageCreatedOn]);


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

    const itemClicked = () => {
        history.replace(`${EmailPath}/${ticketId}`)
    }

    return (<div className={classnames('border-b email-summary cursor-pointer pl-6 pt-4 pb-1.5 pr-0 flex', {'email-summary-selected': urlParams?.ticketId === ticketId})} onClick={() => itemClicked()} >
        <div className='flex flex-row w-full'>
            <div className='pr-4'>
                {userImage}
            </div>
            <div className='flex flex-col'>
                <div className='flex flex-row items-center'>
                    <div className='body1 truncate w-48'>
                        <HighlighterText text={createdForName ? createdForName : createdForEndpoint} highlighterText={searchTerm} />
                    </div>
                    <div className='body3-small w-16 justify-end flex flex-row'>{getDate}</div>
                </div>
                <div className='flex flex-row'>
                    <div className={classnames('w-48 email-summary-display', {'body3-medium': isRead, 'body3-big': !isRead})}>
                        <HighlighterText text={messageSummary} highlighterText={searchTerm} />
                    </div>
                    {!isRead &&
                        <div className='justify-end flex flex-row w-full'>
                            <div className='w-min pt-1'>
                                <Badge text={unreadCount?.toString()} />
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    </div>);
}

export default EmailSummaryItemView;
