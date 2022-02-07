import { RootState } from '@app/store';
import { createSelector } from '@reduxjs/toolkit';
import {EmailMessageDto} from '@shared/models';
export const externalEmailState = (state: RootState) => state.externalAccessState.externalEmailState;

export const selectExternalEmailSummaries = createSelector(
    externalEmailState,
    items => items.emails as EmailMessageDto[]
)


export const selectExternalEmailMarkAsRead = createSelector(
    externalEmailState,
    items => items.markAsRead as boolean
)
