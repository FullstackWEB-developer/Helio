import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import initialAppState from './app.initial-state';
import {NotificationTemplate} from '@shared/models/notification-template.model';
import {AppParameter} from '@shared/models/app-parameter.model';
const appSlice = createSlice({
    name: 'app',
    initialState: initialAppState,
    reducers: {
        setGlobalLoading(state, {payload}: PayloadAction<boolean>) {
            state.isGlobalLoading = payload;
        },
        setEmailTemplates(state, {payload}: PayloadAction<NotificationTemplate[]>) {
            state.emailTemplates = payload;
        },
        setSmsTemplates(state, {payload}: PayloadAction<NotificationTemplate[]>) {
            state.smsTemplates = payload;
        },
        setNavigationChanged(state, {payload}: PayloadAction<boolean>) {
            state.isNavigationChanging = payload;
        },
        setAppParameters(state, {payload}: PayloadAction<AppParameter[]>) {
            state.appParameters = payload;
        },
        clearAppParameters(state) {
            state.appParameters = [];
        },
        setDisplayLoginRequired(state, {payload} : PayloadAction<boolean>) {
            state.displayLoginRequired = payload;
        },
        setLoginRequiredDismissed(state, {payload} : PayloadAction<boolean>) {
            state.loginRequiredDismissed = payload;
        },
    }
});

export const {
    setGlobalLoading,
    setEmailTemplates,
    setSmsTemplates,
    setNavigationChanged,
    setAppParameters,
    clearAppParameters,
    setDisplayLoginRequired,
    setLoginRequiredDismissed
} = appSlice.actions

export default appSlice.reducer
