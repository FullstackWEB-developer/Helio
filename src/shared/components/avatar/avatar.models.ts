import {UserStatus} from '../../store/app-user/app-user.models';

export interface AvatarModel {
    initials: string;
    status?: UserStatus;
    className?: string;
}
