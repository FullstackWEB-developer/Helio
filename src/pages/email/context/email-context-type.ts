import {PagedList, TicketMessageSummary, TicketMessageSummaryRequest} from '@shared/models';
import {EmailQueryType} from '@pages/email/models/email-query-type';
import {UseInfiniteQueryResult} from 'react-query';

export type EmailContextType = {
    emailQueryType?: EmailQueryType;
    setEmailQueryType:(emailQueryType: EmailQueryType) => void;
    messageSummaries: TicketMessageSummary[];
    setMessageSummaries: (summaries: TicketMessageSummary[]) => void;
    queryParams: TicketMessageSummaryRequest;
    setQueryParams: (TicketMessageSummaryRequest) => void;
    getEmailsQuery: UseInfiniteQueryResult<PagedList<TicketMessageSummary>>
    isDefaultTeamView: boolean;
}
