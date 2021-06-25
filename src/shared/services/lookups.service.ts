import {KeyValuePair} from '../models/key-value-pair';
import {Dispatch} from '@reduxjs/toolkit';
import {setError} from '@components/search-bar/store/search-bar.slice';
import {
    setDepartments,
    setLoading,
    setMetricOptions,
    setProviders,
    setUserList,
} from '../store/lookups/lookups.slice';
import Api from './api';
import Logger from './logger';
import store from '../../app/store';
import {setFailure} from '@pages/tickets/store/tickets.slice';
import {User} from '../models/user';
import {QueueMetric} from '../models/queue-metric.model';
import {QuickConnectExtension} from '../models/quick-connect-extension';
import {QueueCurrentMetricQuery} from "@shared/models/queue-current-metric-query";
import {PerformanceMetric} from '@pages/dashboard/models/performance-metric.model';
import {AgentStatus} from '@shared/models/agent-status.model';

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
                .catch((error) => {
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

export const getDepartments = () => {
    const url = lookupsUrl + '/departments';
    const departments = store.getState().lookupsState.departmentList;
    return async (dispatch: Dispatch) => {
        if (!departments || departments.length === 0) {
            dispatch(setError(false));
            dispatch(setLoading(true));
            await Api.get(url)
                .then((response) => {
                    dispatch(setDepartments(response.data));
                })
                .catch((error) => {
                    if (error.response?.status === 404) {
                        dispatch(setDepartments(undefined));
                    } else {
                        logger.error('Failed getting Departments', error);
                        dispatch(setError(true));
                        dispatch(setDepartments(undefined));
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
    const url = '/users/list';
    const userList = store.getState().lookupsState.userList;
    return async (dispatch: Dispatch) => {
        if (!userList || userList.length === 0) {
            try {
                const response = await Api.get(url);
                const list = response.data as User[];
                dispatch(setUserList(list));
            } catch (error) {
                dispatch(setFailure(error.message));
            }
        }
    };
};

export const getQueueStatus = async (query?: QueueCurrentMetricQuery) : Promise<QueueMetric[]> => {
    let url = '/lookups/queue-metrics';

    const response = await Api.get(url, {
        params: {
            agentUsername: query?.agentUsername,
            grouping: query?.grouping
        }
    });
    return response.data;
};

export const getAgentsStatus = async () : Promise<AgentStatus[]> => {
    let url = '/lookups/agents-status';
    const response = await Api.get(url);
    return response.data;
};

export const GetTodaysPerformanceMetrics = async () : Promise<PerformanceMetric[]> => {
    let url = '/lookups/queue-history';
    const response = await Api.get(url);
    return response.data as PerformanceMetric[];
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
            } catch (error) {
                dispatch(setFailure(error.message));
            }
        }
    };
};

export const getQuickConnects = async () => {
    const url = 'lookups/quick-connects';
    const response = await Api.get(url);
    return response.data as QuickConnectExtension[];
};
