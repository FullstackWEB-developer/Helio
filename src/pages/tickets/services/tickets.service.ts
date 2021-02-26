import { Dispatch } from '@reduxjs/toolkit';
import Logger from '../../../shared/services/logger';
import {
    add,
    changeStatus,
    changeAssignee,
    setFailure,
    startRequestAddNote,
    endRequestAddNote
} from '../store/tickets.slice';
import Api from '../../../shared/services/api';
import { TicketNote } from '../models/ticket-note';

const logger = Logger.getInstance();
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

export const setStatus = (id: string, status: number) => {
    let url = ticketsUrl + '/' + id + '/status';
    return async (dispatch: Dispatch) => {
        await Api.put(url, {
            id: id,
            status: status
        })
        .then(() => {
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

export const setAssignee = (id: string, assignee: string) => {
    let url = ticketsUrl + '/' + id + '/assignee';
    return async (dispatch: Dispatch) => {
        await Api.put(url, {
            id: id,
            assignee: assignee
        })
            .then(() => {
                dispatch(changeAssignee({
                    id: id,
                    assignee: assignee
                }));
            })
            .catch(err => {
                dispatch(setFailure(err.message));
            });
    }
}

export const addNote = (id: string, note: TicketNote) => {
    let url = ticketsUrl + '/' + id + '/notes';

    return async (dispatch: Dispatch) => {
        dispatch(startRequestAddNote());
        await Api.post(url, note)
            .then(() => {
                dispatch(endRequestAddNote(''));
            })
            .catch(error => {
                logger.error('Failed to add Note', error);
                dispatch(endRequestAddNote('ccp.note_context.error'));
            })
    }
}
