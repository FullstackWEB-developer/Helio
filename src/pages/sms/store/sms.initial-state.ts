import {TicketMessageSummary} from '@shared/models';
import {UnreadSms} from '@pages/sms/models/unread-sms.model';

export interface SmsInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadSmsMessages: UnreadSms[];
    lastSmsDate: Date;
}

const initialSmsState: SmsInitialState = {
    messageSummaries: [],
    unreadSmsMessages: [],
    lastSmsDate: new Date()
}

export default initialSmsState;
