import {RootState} from '@app/store';
import {createSelector} from '@reduxjs/toolkit';
import {NotificationTemplate} from '@shared/models/notification-template.model';
import {KeyValuePair} from '@shared/models';
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

export const selectIsNavigationChanging = createSelector(
    appState,
    state => state.isNavigationChanging as boolean
);

export const selectAppParameters = createSelector(
    appState,
    state => state.appParameters as KeyValuePair[]
);

export const selectAppParameter = (state: RootState, key: string): KeyValuePair => {
    return state.appState.appParameters.find((a: KeyValuePair) => a.key === key);
}
