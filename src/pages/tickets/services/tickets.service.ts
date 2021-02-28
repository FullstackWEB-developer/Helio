import { Dispatch } from '@reduxjs/toolkit';
import Api from '../../../shared/services/api';
import { Assignee, Paging } from '../store/tickets.initial-state';
import Logger from '../../../shared/services/logger';
import { LookupValue } from '../models/lookup-value';
import { TicketNote } from '../models/ticket-note';
import store from '../../../app/store';
import {
    add,
    changeStatus,
    changeAssignee,
    setFailure,
    addPaging,
    setAssignees,
    setTicketsLoading,
    startRequestAddNote,
    endRequestAddNote,
    setTicketEnum,
    startGetTicketEnumRequest,
    endGetTicketEnumRequest,
    setLookupValues,
    startGeLookupValuesRequest,
    endGetLookupValuesRequest
} from '../store/tickets.slice';
import { Ticket } from '../models/ticket';

const logger = Logger.getInstance();
let ticketsUrl = '/tickets';
const usersUrl = '/users';

export function getList(ticketsPaging?: Paging, searchTerm?: string) {
    return async (dispatch: Dispatch) => {
        dispatch(setTicketsLoading(true));
        try {
            if (ticketsPaging?.pageSize) {
                ticketsUrl = `${ticketsUrl}?pageSize=${ticketsPaging.pageSize}&page=${ticketsPaging.page}`
            }
            if (searchTerm) {
                ticketsUrl = `${ticketsUrl}&searchTerm=${searchTerm}`;
            }
            const response = await Api.get(ticketsUrl);
            const data = response.data;
            dispatch(add(data.results));
            const paging: Paging = { pageSize: data.pageSize, totalPages: data.totalPages, page: data.page, totalCount: data.totalCount };
            dispatch(addPaging(paging));
            dispatch(setTicketsLoading(false));
        } catch (error) {
            dispatch(setFailure(error.message));
        }
    }
}

export const setStatus = (id: string, status: number) => {
    const url = `${ticketsUrl}/${id}/status`;
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
    const url = `${ticketsUrl}/${id}/assignee`;
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

export const getAssigneeList = () => {
    const url = usersUrl + '/list';
    return async (dispatch: Dispatch) => {
        try {
            const response = await Api.get(url);
            const assigneeList = response.data as Assignee[];
            dispatch(setAssignees(assigneeList));
        } catch (error) {
            dispatch(setFailure(error.message));
        }
    }
};
export const addNote = (id: string, note: TicketNote) => {
    const url = `${ticketsUrl}/${id}/notes`;
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

export const getEnumByType = (enumType: string) => {
    const getEnumUrl = `${ticketsUrl}/lookup/${enumType}`;

    return async (dispatch: Dispatch) => {
        dispatch(startGetTicketEnumRequest());
        await Api.get(getEnumUrl)
            .then(response => {
                dispatch(setTicketEnum({ key: enumType, result: response.data }));
                dispatch(endGetTicketEnumRequest(''));
            })
            .catch(error => {
                logger.error(`Failed getting ${enumType}`, error);
                dispatch(endGetTicketEnumRequest('ticket-new.error'));
            });
    }
}

export const getLookupValues = (key: string) => {
    const getLookupValuesUrl = `/lookups/values/${key}`;
    const stateLookupValues = store.getState().ticketState.lookupValues;
    const lookupValue = stateLookupValues ?
        store.getState().ticketState.lookupValues.find((a: LookupValue) => a.key === key) : undefined;
    return async (dispatch: Dispatch) => {
        if (!lookupValue) {
            dispatch(startGeLookupValuesRequest());
            await Api.get(getLookupValuesUrl)
                .then(response => {
                    dispatch(setLookupValues({ key: key, result: response.data }));
                    dispatch(endGetLookupValuesRequest(''));
                })
                .catch(error => {
                    logger.error(`Failed getting Lookup values`, error);
                    dispatch(endGetLookupValuesRequest('ticket-new.error'));
                });
        }
    }
}

export const createTicket = (data: Ticket) => {
    const createTicketUrl = ticketsUrl;
    return async () => {
        await Api.post(createTicketUrl, data)
            .then()
            .catch(error => {
                logger.error(`Failed creating new ticket`, error);
            });
    }
}
