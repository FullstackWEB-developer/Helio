export interface LiveAgentStatusInfo {
    userId: string;
    name?: string;
    status: string;
    profilePicture?: string;
    timestamp?: Date;
    calls?: LiveAgentStatusItemInfo[];
    chats?: LiveAgentStatusItemInfo[];
}

export interface LiveAgentStatusItemInfo {
    customerData: string;
    timestamp: Date
}
