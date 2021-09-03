export interface UserBase {
    id: string,
    firstName: string,
    lastName: string,
    profilePicture?: string;
}

export interface User extends UserBase {
    latestConnectStatus: string;
    email: string;
}
