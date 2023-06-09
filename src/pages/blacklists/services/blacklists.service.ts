import {PagedList} from '@shared/models/paged-list.model';
import Api from '@shared/services/api';
import {BlacklistModel, BlacklistRequest, BlockAccessModel} from '../models/blacklist.model';

const blackListUrl = '/security/blockedaccess'

export const getBlacklist = async (request: BlacklistRequest): Promise<PagedList<BlacklistModel>> => {
    const {data} = await Api.get(blackListUrl, {params: request});
    return data;
}

export const createBlockAccess = async (model: BlockAccessModel) : Promise<BlacklistModel> => {
    const {data} = await Api.post(blackListUrl, model);
    return data;
}

export const unblockAccess = async (id: string) => {
    await Api.put(`${blackListUrl}/${id}`);
}

export const isUserEmailBlocked = async (email: string | undefined) => {
    const url = `${blackListUrl}/email/${email}`;
    const response = await Api.get(url);
    return response.data;
}

export const isUserPhoneBlocked = async (phone: string | undefined) => {
    const url = `${blackListUrl}/phone/${phone}`;
    const response = await Api.get(url);
    return response.data;
}