import SmsChatSummary from './sms-chat-summary';
import classnames from 'classnames';
import {TicketMessageSummary} from '@shared/models';
import Spinner from '@components/spinner/Spinner';
import utils from '@shared/utils/utils';

interface SmsSummaryListProps {
    className?: string;
    data: TicketMessageSummary[],
    selectedTicketId?: string;
    isLoading?: boolean;
    onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    onClick?: (ticketMessageSummary: TicketMessageSummary) => void;
}

const SmsSummaryList = ({data, className, isLoading, selectedTicketId, ...props}: SmsSummaryListProps) => {

    return (<div
        className={classnames('overflow-y-auto', className)}
        onScroll={props.onScroll}
    >
        <>
            {
                data.map(p => <SmsChatSummary
                    patientId={p.patientId}
                    contactId={p.contactId}
                    messageSummary={p.messageSummary}
                    unreadCount={p.unreadCount}
                    createdForName={p.createdForName}
                    createdForMobileNumber={utils.applyPhoneMask(p.createdForMobileNumber)}
                    messageSendAt={p.messageCreatedOn}
                    messageSendBy={p.messageCreatedByName}
                    ticketId={p.ticketId}
                    isSelected={!!selectedTicketId && selectedTicketId === p.ticketId}
                    key={p.ticketId}
                    onClick={() => props.onClick && props.onClick(p)}
                />)
            }
            <div className={classnames('flex flex-row justify-center', {'hidden': !isLoading})}>
                <Spinner />
            </div>
        </>
    </div>);
}

export default SmsSummaryList;
