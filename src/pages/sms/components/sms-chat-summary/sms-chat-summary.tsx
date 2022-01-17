import Avatar from '@shared/components/avatar/avatar';
import Badge from '@shared/components/badge';
import HighlighterText from '@shared/components/highlighter-text/highlighter-text';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classnames from 'classnames';
import {TicketMessageFilterMatch} from '@shared/models';
import './sms-chat-summary.scss';
import utils from '@shared/utils/utils';
import {useMemo} from 'react';
import {Icon} from '@components/svg-icon';
import {useTranslation} from 'react-i18next';
import isToday from 'dayjs/plugin/isToday';
import {useQuery} from 'react-query';
import {GetPatientPhoto} from '@constants/react-query-constants';
import {getPatientPhoto} from '@pages/patients/services/patients.service';
dayjs.extend(utc);
dayjs.extend(isToday);

interface SmsSummaryProps {
    ticketId: string;
    messageSummary: string;
    unreadCount: number;
    patientId?: number;
    contactId?: string;
    createdForName: string;
    createdForMobileNumber: string;
    messageSendBy: string;
    messageSendAt: Date;
    isSelected?: boolean;
    searchTerm?: string;
    searchFilterMatch?: TicketMessageFilterMatch[];
    onClick?: (ticketId: string) => void;
}

const SmsChatSummary = ({
    ticketId,
    messageSummary,
    unreadCount,
    createdForName,
    createdForMobileNumber,
    messageSendAt,
    messageSendBy,
    isSelected,
    searchTerm,
    searchFilterMatch,
    ...props}: SmsSummaryProps) => {

    const isRead = unreadCount === 0;
    const {t} = useTranslation();
    

    const searchFilter = useMemo(() => {
        const getFilterMatchName = (filter: TicketMessageFilterMatch): string => {
            switch (filter) {
                case TicketMessageFilterMatch.MessageBody:
                    return t('sms.messages');
                case TicketMessageFilterMatch.Address:
                    return t('sms.phone');
                case TicketMessageFilterMatch.TicketNumber:
                    return t('sms.ticket_number');
                default:
                    return '';
            }
        }
        
        return searchFilterMatch?.map(getFilterMatchName) ?? []
    }, [searchFilterMatch, t]);

    const {data: patientPhoto} = useQuery([GetPatientPhoto, props.patientId], () => getPatientPhoto(props.patientId!), {
        enabled: !!props.patientId
    });

    const getDate = () => {
        if (dayjs(messageSendAt).isToday()) {
            return dayjs.utc(messageSendAt).local().format('hh:mm A');
        } else {
            return dayjs.utc(messageSendAt).local().format('MMM D');
        }
    }

    const getImage = () => {
        if (patientPhoto && patientPhoto.length > 0) {
            return <img alt={t('patient.summary.profile_pic_alt_text')} className='w-10 h-10 rounded-full'
                        src={`data:image/jpeg;base64,${patientPhoto}`} />
        }

        return <Avatar userFullName={createdForName} />
    }

    return (<div className={classnames('border-b sms-summary cursor-pointer', {'sms-summary-selected': isSelected})} onClick={() => props.onClick && props.onClick(ticketId)}>
        <div className='flex flex-row pl-5 pt-2.5 pb-1.5 pr-4'>
            <div className="pr-4">
                {!!createdForName && getImage()}
                {!createdForName &&
                    <Avatar icon={Icon.UserUnknown} />
                }
            </div>
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <span className='body1 w-4/6'>
                        <HighlighterText text={createdForName ? createdForName : createdForMobileNumber} highlighterText={searchTerm} />
                    </span>
                    <span className='body3-small'>{getDate()}</span>
                </div>
                <div className="flex flex-row justify-between">
                    <div className='w-full'>
                        <div className={classnames('pr-3.5', {'sms-summary-message-read': isRead, 'sms-summary-message-unread': !isRead})}>
                            <HighlighterText text={messageSummary} highlighterText={searchTerm} />
                        </div>
                        {searchFilterMatch && searchFilterMatch.length > 0 &&
                            <div style={{fontSize: 12}} className='flex flex-row flex-wrap items-center w-full border-t body3'>{t('sms.found_in')} {utils.stringJoin(', ', ...searchFilter)}</div>
                        }
                    </div>
                    {!isRead &&
                        <Badge text={unreadCount?.toString()} />
                    }
                </div>
            </div>

        </div>
    </div>);
}

export default SmsChatSummary;
