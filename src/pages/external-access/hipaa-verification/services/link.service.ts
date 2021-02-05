import Api from '../../../../shared/services/api';
import Logger from '../../../../shared/services/logger';
import { Dispatch } from '@reduxjs/toolkit';
import { setRedirectLink, clearRedirectLink, setLoading, setError } from '../store/redirect-link-slice.slice';
const logger = Logger.getInstance();
const redirectUrl = '/notifications';

export const getRedirectLink = (linkId: string) => {
    const url = redirectUrl + '/' + linkId;

    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setRedirectLink(response.data))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(clearRedirectLink());
                        break;
                    default:
                        logger.error('Failed getting RedirectLink', error);
                        dispatch(setError(true));
                        dispatch(clearRedirectLink());
                        break;
                }
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }
}
