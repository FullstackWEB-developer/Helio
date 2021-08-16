import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';
import {NotificationTemplate} from '@shared/models/notification-template.model';
export const appState = (state: RootState) => state.appState

export const selectGlobalLoading = createSelector(
    appState,
    state => state.isGlobalLoading as boolean
)

export const selectEmailTemplates = createSelector(
    appState,
    state => state.emailTemplates as NotificationTemplate[]
)

export const selectSmsTemplates = createSelector(
    appState,
    state => state.smsTemplates as NotificationTemplate[]
)

export const selectModalOverlayActive = createSelector(
    appState,
    state => state.modalOverlayActive as boolean
);


export const selectIsNavigationChanging = createSelector(
    appState,
    state => state.isNavigationChanging as boolean
);
