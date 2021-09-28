import Avatar from '@shared/components/avatar/avatar';
import Badge from '@shared/components/badge';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import classnames from 'classnames';
import './sms-chat-summary.scss';
dayjs.extend(utc);

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
    ...props}: SmsSummaryProps) => {

    const isRead = unreadCount === 0;
    return (<div className={classnames('border-b sms-summary cursor-pointer', {'sms-summary-selected': isSelected})} onClick={() => props.onClick && props.onClick(ticketId)}>
        <div className='flex flex-row pl-5 pt-2.5 pb-1.5 pr-4'>
            <div className="pr-4"><Avatar userFullName={createdForName} /></div>
            <div className="flex flex-col w-full">
                <div className="flex justify-between">
                    <span className='body1'>{createdForName ? createdForName : createdForMobileNumber}</span>
                    <span className='body3-small'>{dayjs.utc(messageSendAt).local().format('hh:mm A')}</span>
                </div>
                <div className="flex flex-row justify-between">
                    <div className={classnames('pr-3.5', {'sms-summary-message-read': isRead, 'sms-summary-message-unread': !isRead})}>
                        {messageSummary}
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
