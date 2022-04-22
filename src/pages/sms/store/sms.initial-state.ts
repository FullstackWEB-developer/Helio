import {TicketMessageSummary} from '@shared/models';

export interface SmsInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadSmsMessages: number;
    lastSmsDate: Date;
    isFiltered: Boolean;
}

const initialSmsState: SmsInitialState = {
    messageSummaries: [],
    unreadSmsMessages: 0,
    lastSmsDate: new Date(),
    isFiltered: false
}

export default initialSmsState;
