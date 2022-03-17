import {KeyValuePair} from '@shared/models';
import {Dispatch} from '@reduxjs/toolkit';
import {setError} from '@components/search-bar/store/search-bar.slice';
import {
    setAllProviders,
    setLoading,
    setLocations,
    setMetricOptions,
    setProviders,
    setRatingOptions,
    setUserList,
} from '../store/lookups/lookups.slice';
import Api from './api';
import Logger from './logger';
import store from '../../app/store';
import {setFailure} from '@pages/tickets/store/tickets.slice';
import {User} from '../models/user';

const logger = Logger.getInstance();

const lookupsUrl = '/lookups';

export const getProviders = () => {
    const url = `${lookupsUrl}/providers`;

    const providers = store.getState().lookupsState.providerList;
    return async (dispatch: Dispatch) => {
        if (!providers || providers.length === 0) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            await Api.get(url)
                .then((response) => {
                    dispatch(setProviders(response.data));
                })
                .catch((error: any) => {
                    if (error.response?.status === 404) {
                        dispatch(setProviders(undefined));
                    } else {
                        logger.error('Failed getting Providers', error);
                        dispatch(setError(true));
                        dispatch(setProviders(undefined));
                        dispatch(setLoading(false));
                    }
                });
        }
    };
};

export const getAllProviders = () => {
    const url = `${lookupsUrl}/providers`;
    const providers = store.getState().lookupsState.allProviderList;
    return async (dispatch: Dispatch) => {
        if (!providers || providers.length === 0) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            await Api.get(url, {
                params: {
                    includeAll: true
                }
            })
                .then((response) => {
                    dispatch(setAllProviders(response.data));
                })
                .catch((error: any) => {
                    if (error.response?.status === 404) {
                        dispatch(setAllProviders(undefined));
                    } else {
                        logger.error('Failed getting Providers', error);
                        dispatch(setError(true));
                        dispatch(setAllProviders(undefined));
                        dispatch(setLoading(false));
                    }
                });
        }
    };
};


export const getLocations = () => {
    const url = lookupsUrl + '/departments';
    const departments = store.getState().lookupsState.locationList;
    return async (dispatch: Dispatch) => {
        if (!departments || departments.length === 0) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            await Api.get(url)
                .then((response) => {
                    dispatch(setLocations(response.data));
                })
                .catch((error) => {
                    if (error.response?.status === 404) {
                        dispatch(setLocations(undefined));
                    } else {
                        logger.error('Failed getting Locations', error);
                        dispatch(setError(true));
                        dispatch(setLocations(undefined));
                        dispatch(setLoading(false));
                    }
                });
        }
    };
};

export const getStates = async () => {
    const result = await Api.get(`${lookupsUrl}/states`);
    return result.data;
};

export const getUserList = () => {
    const url = '/users';
    const userList = store.getState().lookupsState.userList;
    return async (dispatch: Dispatch) => {
        if (!userList || userList.length === 0) {
            try {
                const response = await Api.get(url, {
                    params: {
                        pageSize: 1000
                    }
                });
                const list = response.data.results as User[];
                dispatch(setUserList(list));
            } catch (error: any) {
                dispatch(setFailure(error.message));
            }
        }
    };
};

export const getMetricOptions = () => {
    const url = 'lookups/CurrentMetricEnum';
    const metricOptions = store.getState().lookupsState.metricOptions;
    return async (dispatch: Dispatch) => {
        if (!metricOptions || metricOptions.length === 0) {
            try {
                const response = await Api.get(url);
                const list = response.data as KeyValuePair[];
                dispatch(setMetricOptions(list));
            } catch (error: any) {
                dispatch(setFailure(error.message));
            }
        }
    };
};

export const getRatingOptions = () => {
    const url = 'lookups/Rating';
    const ratingOptions = store.getState().lookupsState.ratingOptions;
    return async (dispatch: Dispatch) => {
        if (!ratingOptions || ratingOptions.length === 0) {
            try {
                const response = await Api.get(url);
                dispatch(setRatingOptions(response.data));
            }
            catch (error: any) {
                dispatch(setFailure(error.message));
            }
        }
    }
}