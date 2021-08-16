import {NotificationTemplate} from '@shared/models/notification-template.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
    modalOverlayActive: boolean;
    isNavigationChanging: boolean;
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: [],
    modalOverlayActive: false,
    isNavigationChanging: false
}

export default initialAppState;
