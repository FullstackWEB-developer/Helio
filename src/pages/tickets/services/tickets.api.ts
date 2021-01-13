import Api from '../../../shared/services/api';
import {Dispatch} from "@reduxjs/toolkit";
import {add, changeStatus, setFailure} from "../store/tickets.slice";

const ticketsUrl = '/tickets';

export function getList() {
    return async (dispatch: Dispatch) => {
        try {
            const response = await Api.get(ticketsUrl);
            const data = response.data.results;

            dispatch(add(data));
        } catch (error) {
            dispatch(setFailure(error.message));
        }
    }
}

export const setStatus = (id: number, status: number) => {
    let url = ticketsUrl + '/' + id + '/status';
    return async (dispatch: Dispatch) => {
        await Api.put(url, {
            id: id,
            status: status
        })
        .then(res => {
            dispatch(changeStatus({
                id: id,
                status: status
            }));
        })
        .catch(err => {
            dispatch(setFailure(err.message));
        });
    }
}
