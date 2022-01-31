import SmsChatSummary from './sms-chat-summary';
import classnames from 'classnames';
import {TicketMessageSummary} from '@shared/models';
import Spinner from '@components/spinner/Spinner';
import dayjs from 'dayjs';
import React from 'react';

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


    return (<div
        className={classnames('overflow-y-auto', className)}
        onScroll={props.onScroll}
    >
        <>
            {
                [...data].sort((a, b) => dayjs.utc(b.messageCreatedOn).valueOf() - dayjs.utc(a.messageCreatedOn).valueOf()).map(smsInfo =>
                    <SmsChatSummary
                        smsInfo={smsInfo}
                        isSelected={!!selectedTicketId && selectedTicketId === smsInfo.ticketId}
                        key={smsInfo.ticketId}
                        searchTerm={searchTerm}
                        onClick={() => props.onClick && props.onClick(smsInfo)}
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
