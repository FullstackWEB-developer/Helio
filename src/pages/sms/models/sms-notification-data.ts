export interface SmsNotificationData {
    ticketId: string;
    channelId: string;
    messageId: string;
    assignedToUserId: string;
    createdOn: Date;
    persist: boolean;
}