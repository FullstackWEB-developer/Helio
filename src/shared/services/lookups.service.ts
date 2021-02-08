import {Dispatch} from "@reduxjs/toolkit";
import {setError} from "../components/search-bar/store/search-bar.slice";
import {
    setDepartments,
    setLoading,
    setProviders
} from '../store/lookups/lookups.slice';
import Api from "./api";
import Logger from "./logger";

const logger = Logger.getInstance();

const lookupsUrl = '/lookups';
export const getProviders = () => {
    const url = lookupsUrl + '/providers';

    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setProviders(response.data))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(setProviders(undefined));
                        break;
                    default:
                        logger.error('Failed getting Providers', error);
                        dispatch(setError(true));
                        dispatch(setProviders(undefined));
                        dispatch(setLoading(false));
                        break;
                }
            })
    }
}
export const getDepartments = () => {
    const url = lookupsUrl + '/departments';

    return async (dispatch: Dispatch) => {
        dispatch(setError(false));
        dispatch(setLoading(true));
        await Api.get(url)
            .then(response => {
                dispatch(setDepartments(response.data))
            })
            .catch(error => {
                switch (error.response?.status) {
                    case 404:
                        dispatch(setDepartments(undefined));
                        break;
                    default:
                        logger.error('Failed getting Departments', error);
                        dispatch(setError(true));
                        dispatch(setDepartments(undefined));
                        dispatch(setLoading(false));
                        break;
                }
            })
    }
}
