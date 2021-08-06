import {CheckboxCheckEvent} from '@components/checkbox/checkbox';
import {UserDetailStatus, UserInvitationStatus} from '@shared/models';

export interface UserListCheckedState {
    checkboxCheckEvent: CheckboxCheckEvent;
    userStatus: UserDetailStatus;
    userInvitationStatus?: UserInvitationStatus;
    userEmail: string;
}