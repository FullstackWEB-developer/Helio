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
dayjs.extend(utc);
dayjs.extend(isToday)

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
    const getFilterMatchName = (filter: TicketMessageFilterMatch): string => {
        switch (filter) {
            case TicketMessageFilterMatch.MessageBody:
                return t('sms.messages');
            case TicketMessageFilterMatch.Phone:
                return t('sms.phone');
            case TicketMessageFilterMatch.TicketNumber:
                return t('sms.ticket_number');
        }
    }

    const searchFilter = useMemo(() => searchFilterMatch?.map(getFilterMatchName) ?? [], [searchFilterMatch]);

    const getDate = () => {
        if (dayjs(messageSendAt).isToday()) {
            return dayjs.utc(messageSendAt).local().format('hh:mm A');
        } else {
            return dayjs.utc(messageSendAt).local().format('MMM D');
        }
    }

    return (<div className={classnames('border-b sms-summary cursor-pointer', {'sms-summary-selected': isSelected})} onClick={() => props.onClick && props.onClick(ticketId)}>
        <div className='flex flex-row pl-5 pt-2.5 pb-1.5 pr-4'>
            <div className="pr-4">
                {!!createdForName &&
                    <Avatar userFullName={createdForName} />
                }
                {!createdForName &&
                    <Avatar icon={Icon.UserUnknown} />
                }
            </div>
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <span className='body1'>
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
