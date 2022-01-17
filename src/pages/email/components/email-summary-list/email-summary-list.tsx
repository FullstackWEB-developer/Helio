import {TicketMessageSummary} from '@shared/models';
import dayjs from 'dayjs';
import Spinner from '@components/spinner/Spinner';
import EmailSummaryItemView from '@pages/email/components/email-summary-item-view/email-summary-item-view';
import React, {useMemo} from 'react';

export interface EmailSummaryListProps {
    data: TicketMessageSummary[],
    onClick?: (ticketMessageSummary: TicketMessageSummary) => void;
    searchTerm?: string;
    selectedTicketId?: string;
    onScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    isFetchingNextPage: boolean;
}

const EmailSummaryList = ({data, selectedTicketId, searchTerm, onScroll, isFetchingNextPage}: EmailSummaryListProps) => {

    const sortedMessages = useMemo(() =>{
        return data.sort((a, b) => dayjs.utc(b.messageCreatedOn).valueOf() - dayjs.utc(a.messageCreatedOn).valueOf());
    }, [data]);

    return <div className='overflow-y-auto overflow-x-hidden h-full' onScroll={onScroll} >
        <>
            {
                sortedMessages.map((p: TicketMessageSummary) =>
                    <EmailSummaryItemView emailInfo={p} key={p.ticketId} isSelected={selectedTicketId === p.ticketId} searchTerm={searchTerm} onClick={() => {}} />
                )
            }
            {isFetchingNextPage && <Spinner/> }
        </>
    </div>
}

export default EmailSummaryList;
