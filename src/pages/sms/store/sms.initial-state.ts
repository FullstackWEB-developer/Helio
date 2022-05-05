import {TicketMessageSummary} from '@shared/models';

export interface SmsInitialState {
    messageSummaries: TicketMessageSummary[];
    unreadSmsMessages: number;
    lastSmsDate: Date;
    isFiltered: Boolean;
    unreadTeamSms: number;
}

const initialSmsState: SmsInitialState = {
    messageSummaries: [],
    unreadSmsMessages: 0,
    lastSmsDate: new Date(),
    isFiltered: false,
    unreadTeamSms: 0
}

export default initialSmsState;
