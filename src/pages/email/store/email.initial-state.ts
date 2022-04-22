import {TicketMessageSummary} from '@shared/models';

export interface EmailInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadEmails: number;
    lastEmailDate: Date;
    hasFilter: boolean;
}

const initialEmailState: EmailInitialState = {
    messageSummaries: [],
    unreadEmails: 0,
    hasFilter: false,
    lastEmailDate: new Date()
}

export default initialEmailState;
