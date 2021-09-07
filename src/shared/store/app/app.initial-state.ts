import {NotificationTemplate} from '@shared/models/notification-template.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: []
}

export default initialAppState;
