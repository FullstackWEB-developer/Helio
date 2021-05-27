import {User} from '../models/user';
import Api from './api';

const userBaseUrl = '/users';

export const getUserById = async (id: string): Promise<User | undefined> => {
    if (!id) {
        return Promise.resolve(undefined);
    }
    const result = await Api.get(`${userBaseUrl}/${id}`);
    return result.data;
}