export interface AuthenticationInfo {
    accessToken?: string,
    name?: string,
    username?: string,
    expiresOn?: Date,
    isLoggedIn: boolean
}