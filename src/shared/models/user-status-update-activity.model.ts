export interface UserStatusUpdateActivity {
    channel: 'CHAT' |'VOICE';
    contactId: string;
    customerData: string;
    timestamp: Date;
}
