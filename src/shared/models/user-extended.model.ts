export enum CallForwardingType {
    Phone = 1,
    Agent = 2
}

export enum UserDetailStatus {
    Active = 1,
    Inactive = 2
}

export enum UserRole {
    Agent = 1,
    Manager = 2,
    Admin = 3
}

export interface UserDetail {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePicture: string;
    department: string;
    jobTitle: string;
    status: UserDetailStatus;
    roles: string[];
    callForwardingEnabled: boolean;
    callForwardingType?: CallForwardingType;
    callForwardingValue?: string;
    createdByName: string;
    modifiedByName: string;
    createdOn?: string;
    modifiedOn?: string;
    providerId?: number;
    latestConnectStatus?: string;
}

export interface UserDetailExtended {
    user: UserDetail;
    contactQueues: string[];
    contactProfileLink: string;
}

export interface ConnectUser {
    userName: string;
    displayName: string;
}