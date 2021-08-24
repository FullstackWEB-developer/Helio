import {PagedList} from '@shared/models/paged-list.model';
import Api from '@shared/services/api';
import {BlacklistModel, BlacklistRequest, BlockAccessModel, BlockAccessType} from '../models/blacklist.model';

const blackListUrl = '/security/blockedaccess'

export const getBlacklist = async (request: BlacklistRequest): Promise<PagedList<BlacklistModel>> => {
    const {data} = await Api.get(blackListUrl, {params: request});
    return data;
}

export const createBlockAccess = async (model: BlockAccessModel) => {
    const {data} = await Api.post(blackListUrl, model);
    return data;
}

export const unblockAccess = async (id: string) => {
    await Api.put(`${blackListUrl}/${id}`);
}
