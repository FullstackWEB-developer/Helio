import {NotificationTemplate} from '@shared/models/notification-template.model';
import {AppParameter} from '@shared/models/app-parameter.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
    isNavigationChanging: boolean;
    appParameters : AppParameter[];
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: [],
    isNavigationChanging: false,
    appParameters: []
}

export default initialAppState;
