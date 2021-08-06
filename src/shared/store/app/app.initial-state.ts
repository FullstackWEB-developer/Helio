import {NotificationTemplate} from '@shared/models/notification-template.model';

export interface AppState {
    isGlobalLoading: boolean;
    smsTemplates: NotificationTemplate[];
    emailTemplates: NotificationTemplate[];
    modalOverlayActive: boolean;
}
const initialAppState: AppState = {
    isGlobalLoading : false,
    emailTemplates: [],
    smsTemplates: [],
    modalOverlayActive: false
}

export default initialAppState;
