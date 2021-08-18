import {NotificationTemplate} from '@shared/models/notification-template.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
    isNavigationChanging: boolean;
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: [],
    isNavigationChanging: false
}

export default initialAppState;
