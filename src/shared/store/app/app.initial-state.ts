import {NotificationTemplate} from '@shared/models/notification-template.model';
import {AppParameter} from '@shared/models/app-parameter.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
    isNavigationChanging: boolean;
    appParameters : AppParameter[];
    displayLoginRequired: boolean;
    loginRequiredDismissed: boolean;
    dashboardFilterEndDate: Date;
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: [],
    isNavigationChanging: false,
    appParameters: [],
    displayLoginRequired: false,
    loginRequiredDismissed: false,
    dashboardFilterEndDate: new Date()
}

export default initialAppState;
