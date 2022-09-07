import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';
import {TicketMessageSummary} from '@shared/models';

export const emailState = (state: RootState) => state.emailState;

export const selectEmailSummaries = createSelector(
    emailState,
    state => state.messageSummaries as TicketMessageSummary[]
)

export const selectUnreadEmails = createSelector(
    emailState,
    state => state.unreadEmails as number
)

export const selectLastEmailDate = createSelector(
    emailState,
    state => state.lastEmailDate as Date
)

export const selectEmailHasFilter = createSelector(
    emailState,
    state => state.hasFilter as Date
)

export const selectUnreadTeamEmails = createSelector(
    emailState,
    state => state.unreadTeamEmails as number
)

export const selectEmailNewTicketId = createSelector(
    emailState,
    state => state.newTicketId as string
)
