export interface InviteUserModel {
    email?: string;
    providerId?: string;
    roles?: string[];
    name?: string;
}

export interface InviteUserRequest {
    users: InviteUserModel[],
    invitationMessage: string;
}
