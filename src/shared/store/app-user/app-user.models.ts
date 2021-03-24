export interface AuthenticationInfo {
    accessToken?: string,
    name?: string,
    username?: string,
    expiresOn?: Date,
    isLoggedIn: boolean
}

export enum UserStatus {
    AfterWork='after_work',
    Available='available',
    Break='break',
    Busy='busy',
    Meeting='meeting',
    Offline='offline',
    OnCall='on_call',
    Personal='personal',
    Routable ='routable',
    Training='training'
}
