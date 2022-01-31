import {TicketMessageSummary} from '@shared/models';
import {UnreadEmail} from '@pages/email/models/unread-email.model';

export interface EmailInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadEmails: UnreadEmail[];
    lastEmailDate: Date;
}

const initialEmailState: EmailInitialState = {
    messageSummaries: [],
    unreadEmails: [],
    lastEmailDate: new Date()
}

export default initialEmailState;
