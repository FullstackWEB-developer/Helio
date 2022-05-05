import {TicketMessageSummary} from '@shared/models';

export interface EmailInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadEmails: number;
    lastEmailDate: Date;
    hasFilter: boolean;
    unreadTeamEmails: number;
}

const initialEmailState: EmailInitialState = {
    messageSummaries: [],
    unreadEmails: 0,
    hasFilter: false,
    lastEmailDate: new Date(),
    unreadTeamEmails: 0
}

export default initialEmailState;
