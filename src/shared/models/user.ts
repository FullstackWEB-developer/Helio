import {UserDetailStatus} from "./user-extended.model";

export interface UserBase {
    id: string,
    firstName: string,
    lastName: string,
    profilePicture?: string;
    status: UserDetailStatus;
}

export interface User extends UserBase {
    latestConnectStatus: string;
    email: string;
}
