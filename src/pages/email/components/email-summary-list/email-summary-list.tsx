import {TicketMessageSummary} from '@shared/models';
import dayjs from 'dayjs';
import Spinner from '@components/spinner/Spinner';
import EmailSummaryItemView from '@pages/email/components/email-summary-item-view/email-summary-item-view';
import React, {useMemo} from 'react';
import {useTranslation} from 'react-i18next';

export interface EmailSummaryListProps {
    data: TicketMessageSummary[],
    onClick?: (ticketMessageSummary: TicketMessageSummary) => void;
    searchTerm?: string;
    onScroll: (event: React.UIEvent<HTMLDivElement, UIEvent>) => void;
    isFetchingNextPage: boolean;
}

const EmailSummaryList = ({data, searchTerm, onScroll, isFetchingNextPage}: EmailSummaryListProps) => {
    const {t} = useTranslation();
    const sortedMessages = useMemo(() =>{
        return [...data].sort((a, b) => dayjs.utc(b.messageCreatedOn).valueOf() - dayjs.utc(a.messageCreatedOn).valueOf());
    }, [data]);

    if (!sortedMessages || sortedMessages.length === 0) {
        return <div className='body3-small flex pt-4 px-6 text-center'>{t('email.filter.no_emails')}</div>
    }

    return <div className='overflow-y-auto overflow-x-hidden h-full' onScroll={onScroll} >
        <>
            {
                sortedMessages.map((p: TicketMessageSummary) =>
                    <EmailSummaryItemView emailInfo={p} key={p.ticketId} searchTerm={searchTerm} />
                )
            }
            {isFetchingNextPage && <Spinner/> }
        </>
    </div>
}

export default EmailSummaryList;
