export interface AuthenticationInfo {
    accessToken?: string,
    name?: string,
    username?: string,
    expiresOn?: Date,
    isLoggedIn: boolean
}

export enum UserStatus {
    Afterwork='after_work'
}
