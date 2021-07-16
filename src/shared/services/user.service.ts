import {User} from '../models/user';
import Api from './api';

const userBaseUrl = '/users';

export const getUserByEmail = async (email: string): Promise<User | undefined> => {
    if (!email) {
        return Promise.resolve(undefined);
    }
    const result = await Api.get(userBaseUrl,
        {
            params: {
                'email':email
            }
        });
    return result.data;
}

export const getProviderPicture = async(providerId: number) => {
    const url = `${userBaseUrl}/${providerId}/provider-picture`;
    const {data} = await Api.get(url);
    return data;
}
