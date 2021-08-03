export interface NotificationTemplate {
    id: string;
    channel: NotificationTemplateChannel;
    displayText: string;
    subject: string;
    content: string;
    category: string;
    logicKey: string;
    requirePreProcessing: boolean;
}

export enum NotificationTemplateChannel {
    Email= 1,
    Sms,
    EmailSms
}
