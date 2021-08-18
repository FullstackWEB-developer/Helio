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
import {setExternalUserJobTitles, setInvitationStatusList, setUserDepartments, setUserExternalDepartments, setUserJobTitles, setUserStatusList} from '@pages/users/store/users.slice';
import {UserQueryFilter} from '@pages/users/models/user-filter-query.model';
import utils from '@shared/utils/utils';

const userBaseUrl = '/users';

export const getUserByEmail = async (email: string): Promise<PagedList<User> | undefined> => {
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
        const forwardToOptions = store.getState().lookupsState.forwardToOptions;
        return !forwardToOptions || forwardToOptions.length < 1;
    }
);

export const changeUserStatus = async (changeUserStatus: ChangeUserStatusRequest[]): Promise<UserDetail> => {
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
        const roleList = store.getState().lookupsState.roleList;
        return !roleList || roleList.length < 1;
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

export const getUsers = async (queryParams: UserQueryFilter, page = 1, pageSize = 10) => {
    const serializedQueryParams = utils.serialize(queryParams);
    const {data} = await Api.get(`${userBaseUrl}?page=${page}&pageSize=${pageSize}${serializedQueryParams ? `&${serializedQueryParams}` : ''}`);
    return data;
}

export const getUserStatusWithState = queryWithState(
    () => getEnumList('UserStatus'),
    (payload) => setUserStatusList(payload || []),
    () => {
        const userStatusList = store.getState().lookupsState.userStatusList;
        return !userStatusList || userStatusList.length < 1;
    }
);

export const getUserInvitationStatusWithState = queryWithState(
    () => getEnumList('InvitationStatus'),
    (payload) => setInvitationStatusList(payload || []),
    () => {
        const userInvitationStatusList = store.getState().lookupsState.userInvitationStatusList;
        return !userInvitationStatusList || userInvitationStatusList.length < 1;
    }
)

export const getUserDepartmentList = async () => {
    const {data} = await Api.get(`${userBaseUrl}/lookups/departments`);
    return data;
}

export const getUserDepartmentsWithState = queryWithState(
    () => getUserDepartmentList(),
    (payload) => setUserDepartments(payload),
    () => {
        const userDepartments = store.getState().usersState.userDepartments;
        return !userDepartments || userDepartments.length < 1;
    }
)

export const getUserJobTitleList = async () => {
    const {data} = await Api.get(`${userBaseUrl}/lookups/job-titles`);
    return data;
}

export const getUserJobTitleListWithState = queryWithState(
    () => getUserJobTitleList(),
    (payload) => setUserJobTitles(payload),
    () => {
        const jobTitles = store.getState().usersState.jobTitles;
        return !jobTitles || jobTitles.length < 1;
    }
)

export const resendInvite = async (inviteUsersBody: InviteUserRequest) => {
    await Api.post(`${userBaseUrl}/invite`, inviteUsersBody);
}

export const getExternalUsersList = async (queryParams: UserQueryFilter, page = 1, pageSize = 10) => {
    const serializedQueryParams = utils.serialize(queryParams);
    const {data} = await Api.get(`${userBaseUrl}/external-users?page=${page}&pageSize=${pageSize}${serializedQueryParams ? `&${serializedQueryParams}` : ''}`);
    return data;
}

export const getExternalDepartmentList = async () => {
    const {data} = await Api.get(`${userBaseUrl}/external-departments`);
    return data;
}

export const getExternalDepartmentListWithState = queryWithState(
    () => getExternalDepartmentList(),
    (payload) => setUserExternalDepartments(payload),
    () => {
        const externalDepartments = store.getState().usersState.externalDepartments;
        return !externalDepartments || externalDepartments.length < 1;
    }
)

export const getExternalJobTitleList = async () => {
    const {data} = await Api.get(`${userBaseUrl}/external-job-titles`);
    return data;
}

export const getExternalJobTitleListWithState = queryWithState(
    () => getExternalJobTitleList(),
    (payload) => setExternalUserJobTitles(payload),
    () => {
        const externalJobTitles = store.getState().usersState.externalJobTitles;
        return !externalJobTitles || externalJobTitles.length < 1;
    }
)