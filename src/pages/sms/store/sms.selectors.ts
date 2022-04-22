import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';
import {TicketMessageSummary} from '@shared/models';
import {UnreadSms} from '@pages/sms/models/unread-sms.model';

export const smsState = (state: RootState) => state.smsState;

export const selectSmsSummaries = createSelector(
    smsState,
    state => state.messageSummaries as TicketMessageSummary[]
)

export const selectUnreadSmsMessages = createSelector(
    smsState,
    state => state.unreadSmsMessages as number
)

export const selectLastSmsDate = createSelector(
    smsState,
    state => state.lastSmsDate as Date
)


export const selectIsSmsFiltered = createSelector(
    smsState,
    state => state.isFiltered as boolean
)
