import {ExternalUser} from "./user-extended.model";

export interface InviteUserModel {
    email?: string;
    firstName?: string;
    lastName?: string;
    providerId?: string;
    roles?: string[];
    name?: string;
}

export interface SelectExternalUser {
    inviteUserModel: InviteUserModel,
    id: string,
    info: ExternalUser
}

export interface InviteUserRequest {
    users: InviteUserModel[],
    invitationMessage: string;
}
