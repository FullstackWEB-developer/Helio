import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';
import {TicketMessageSummary} from '@shared/models';
import {UnreadEmail} from '@pages/email/models/unread-email.model';

export const emailState = (state: RootState) => state.emailState;

export const selectEmailSummaries = createSelector(
    emailState,
    state => state.messageSummaries as TicketMessageSummary[]
)

export const selectUnreadEmails = createSelector(
    emailState,
    state => state.unreadEmails as UnreadEmail[]
)

export const selectLastEmailDate = createSelector(
    emailState,
    state => state.lastEmailDate as Date
)
