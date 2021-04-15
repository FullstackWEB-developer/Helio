import Api from '@shared/services/api';
const redirectUrl = '/notifications';

export const getRedirectLink = async (linkId: string) => {
    const url = `${redirectUrl}/${linkId}`;
    const response = await Api.get(url);
    return response.data;
}
