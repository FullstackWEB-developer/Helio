import SmsChatSummary from './sms-chat-summary';
import classnames from 'classnames';
import {TicketMessageSummary} from '@shared/models';
import Spinner from '@components/spinner/Spinner';
import utils from '@shared/utils/utils';
import dayjs from 'dayjs';

interface SmsSummaryListProps {
    className?: string;
    data: TicketMessageSummary[],
    selectedTicketId?: string;
    isLoading?: boolean;
    searchTerm?: string;
    onScroll?: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    onClick?: (ticketMessageSummary: TicketMessageSummary) => void;
}

const SmsSummaryList = ({data, className, isLoading, selectedTicketId, searchTerm, ...props}: SmsSummaryListProps) => {

    const determineDisplayName = (createdForName: string) => {
        if (createdForName) {
            if (createdForName.startsWith('+') || /\d/.test(createdForName)) {
                return utils.applyPhoneMask(createdForName);
            }
            return createdForName;
        }
        return '';
    }
    return (<div
        className={classnames('overflow-y-auto', className)}
        onScroll={props.onScroll}
    >
        <>
            {
                data.sort((a, b) => dayjs.utc(b.messageCreatedOn).valueOf() - dayjs.utc(a.messageCreatedOn).valueOf()).map(p =>
                    <SmsChatSummary
                        patientId={p.patientId}
                        contactId={p.contactId}
                        messageSummary={p.messageSummary}
                        unreadCount={p.unreadCount}
                        createdForName={determineDisplayName(p.createdForName)}
                        createdForMobileNumber={utils.applyPhoneMask(p.createdForEndpoint)}
                        messageSendAt={p.messageCreatedOn}
                        messageSendBy={p.messageCreatedByName}
                        searchFilterMatch={p.filterMatches}
                        ticketId={p.ticketId}
                        isSelected={!!selectedTicketId && selectedTicketId === p.ticketId}
                        key={p.ticketId}
                        searchTerm={searchTerm}
                        onClick={() => props.onClick && props.onClick(p)}
                    />
                )
            }
            <div className={classnames('flex flex-row justify-center', {'hidden': !isLoading})}>
                <Spinner />
            </div>
        </>
    </div>);
}

export default SmsSummaryList;
