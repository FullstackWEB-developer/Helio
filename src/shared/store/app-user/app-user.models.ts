export interface AuthenticationInfo {
    accessToken?: string,
    name?: string,
    username?: string,
    expiresOn?: Date,
    isLoggedIn: boolean,
    profilePicture?: string,
    authenticationLink?: string,
    id?: string;
}

export enum UserStatus {
    AfterWork='AfterWork',
    Available='Available',
    Busy='Busy',
    Offline='Offline',
    OnCall='OnCall',
    Routable ='Routable'
}
