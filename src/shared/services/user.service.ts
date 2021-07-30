import {
    ChangeUserStatusRequest,
    ConnectUser,
    InviteUserRequest,
    PagedList,
    PhoneNumber,
    RoleBase,
    UserActiveDirectory,
    UserDetail,
    UserDetailExtended,
    UserDirectoryFilter
} from '@shared/models';
import {User} from '../models/user';
import {setForwardToOptions, setRoleList} from "@shared/store/lookups/lookups.slice";
import {queryWithState} from '@shared/services/query-with-state.util';
import store from '../../app/store';
import Api from './api';
import {TicketEnumValue} from '@pages/tickets/models/ticket-enum-value.model';

const userBaseUrl = '/users';
export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    if (!email) {
        return Promise.resolve(undefined);
    }
    const result = await Api.get(userBaseUrl,
        {
            params: {
                'email': email
            }
        });
    return result.data;
}

export const getProviderPicture = async (providerId: number) => {
    const url = `${userBaseUrl}/${providerId}/provider-picture`;
    const {data} = await Api.get(url);
    return data;
}

export const getUserDetailExtended = async (userId: string): Promise<UserDetailExtended> => {
    const url = `${userBaseUrl}/${userId}/extended`;
    const {data} = await Api.get(url);
    return data;
}

export const getEnumList = async (enumType: string): Promise<TicketEnumValue[] | undefined> => {
    if (!enumType) {
        return Promise.resolve(undefined);
    }

    const {data} = await Api.get(`${userBaseUrl}/lookups/${enumType}`);
    return data;
}

export const getConnectUser = async (): Promise<ConnectUser[]> => {
    const {data} = await Api.get(`${userBaseUrl}/connect-users`);
    return data;
}

export const getCallForwardingTypeWithState = queryWithState(
    () => getEnumList('CallForwardingType'),
    (payload) => setForwardToOptions(payload),
    () => {
        const forwardToOptions = store.getState().forwardToOptions;
        return !forwardToOptions || forwardToOptions < 1;
    }
);

export const changeUserStatus = async (...changeUserStatus: ChangeUserStatusRequest[]): Promise<UserDetail> => {
    const url = `${userBaseUrl}/status`;
    const {data} = await Api.put(url, changeUserStatus);
    return data;
}

export const updateUser = async (user: UserDetail): Promise<UserDetail> => {
    const {data} = await Api.put(userBaseUrl, user);
    return data;
}

export const getRole = async (): Promise<RoleBase[]> => {
    const url = `${userBaseUrl}/roles`;
    const {data} = await Api.get(url);
    return data;
}

export const getRoleWithState = queryWithState(
    () => getRole(),
    (payload) => setRoleList(payload),
    () => {
        const roleList = store.getState().roleList;
        return !roleList || roleList < 1;
    }
);

export const getUserMobilePhone = async (userId: string): Promise<PhoneNumber> => {
    const url = `${userBaseUrl}/${userId}/mobile-phone-number`;
    const {data} = await Api.get(url);
    return data;
}
export const searchUserInDirectory = async (filter: UserDirectoryFilter): Promise<PagedList<UserActiveDirectory>> => {
    const url = `${userBaseUrl}/external-users`;
    const {data} = await Api.get(url, {
        params: filter
    });
    return data;
}

export const sendUserInvitation = async (inviteUser: InviteUserRequest) => {
    const url = `${userBaseUrl}/invite-external`;
    await Api.post(url, inviteUser);
}
