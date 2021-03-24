import {PatientTicketsRequest} from '../models/patient-tickets-request';
import {Dispatch} from '@reduxjs/toolkit';
import Api from '../../../shared/services/api';
import Logger from '../../../shared/services/logger';
import {LookupValue} from '../models/lookup-value';
import {TicketNote} from '../models/ticket-note';
import store from '../../../app/store';
import {
    add,
    addPaging,
    changeAssignee,
    changeStatus,
    endGetLookupValuesRequest,
    endGetTicketEnumRequest,
    endRequestAddFeed,
    endRequestAddNote,
    setFailure,
    setLookupValues,
    setSearchTerm,
    setTicket,
    setTicketDelete,
    setTicketEnum,
    setTicketFilter,
    setTicketsLoading,
    startGeLookupValuesRequest,
    startGetTicketEnumRequest,
    startRequestAddFeed,
    startRequestAddNote
} from '../store/tickets.slice';
import {Ticket} from '../models/ticket';
import {Paging} from '../../../shared/models/paging.model';
import {TicketQuery} from '../models/ticket-query';
import {TicketFeed} from '../models/ticket-feed';

const logger = Logger.getInstance();
const ticketsBaseUrl = '/tickets';

export function getList(ticketQuery: TicketQuery, resetPagination?: boolean) {
    return async (dispatch: Dispatch) => {
        dispatch(setTicketsLoading(true));

        let query: any = ticketQuery;
        let queryParams = serialize(query);
        if (resetPagination) {
            const { totalCount, totalPages, page, ...newQuery } = query;
            queryParams = serialize(newQuery);
        }

        let ticketsUrl = '';
        try {
            ticketsUrl = `${ticketsBaseUrl}?${queryParams}`;
            const response = await Api.get(ticketsUrl);
            const data = response.data;
            dispatch(add(data.results));
            const paging: Paging = {
                pageSize: data.pageSize,
                totalPages: data.totalPages,
                page: data.page > data.totalPages ? data.totalPages : data.page,
                totalCount: data.totalCount
            };
            dispatch(addPaging(paging));
            dispatch(setSearchTerm(query.searchTerm ? query.searchTerm : ''));

            const saveQuery: TicketQuery = {
                ...paging,
                ...query
            };
            dispatch(setTicketFilter(saveQuery));

            dispatch(setTicketsLoading(false));
        } catch (error) {
            dispatch(setFailure(error.message));
        }
    }
}

const serialize = (obj: any) => {
    const str = [];
    for (const p in obj) {
        if (obj.hasOwnProperty(p)) {
            if (Array.isArray(obj[p])) {
                obj[p].forEach((a: any) => {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(a)}`);
                })
            } else {
                if (obj[p] instanceof Date) {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p].toISOString())}`);
                } else {
                    str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
                }

            }
        }
    }
    return str.join("&");
}

export const setStatus = (id: string, status: number) => {
    const url = `${ticketsBaseUrl}/${id}/status`;
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
    const url = `${ticketsBaseUrl}/${id}/assignee`;
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
    const url = `${ticketsBaseUrl}/${id}/notes`;
    return async (dispatch: Dispatch) => {
        dispatch(startRequestAddNote());
        await Api.post(url, note)
            .then((response) => {
                dispatch(endRequestAddNote(''));
                dispatch(setTicket(response.data));
            })
            .catch(error => {
                logger.error('Failed to add Note', error);
                dispatch(endRequestAddNote('ccp.note_context.error'));
            })
    }
}

export const addFeed = (id: string, feed: TicketFeed) => {
    const url = `${ticketsBaseUrl}/${id}/feed`;
    return async (dispatch: Dispatch) => {
        dispatch(startRequestAddFeed());
        await Api.post(url, feed)
            .then((response) => {
                dispatch(endRequestAddFeed(''));
                dispatch(setTicket(response.data));
            })
            .catch(error => {
                logger.error('Failed to add Feed', error);
                dispatch(endRequestAddNote('ticket_detail.feed.error'));
            })
    }
}

export const getEnumByType = (enumType: string) => {
    const getEnumUrl = `${ticketsBaseUrl}/lookup/${enumType}`;

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

export const createTicket = async (data: Ticket) => {
    await Api.post(ticketsBaseUrl, data)
        .then()
        .catch(error => {
            logger.error(`Failed creating new ticket`, error);
        });
}

export const updateTicket = async (id: string, data: Ticket) => {
    const url = `${ticketsBaseUrl}/${id}`;
    let patchData = [];
    for (let [key, value] of Object.entries(data)) {
        if (value) {
            patchData.push({
                op: 'replace',
                path: '/' + key,
                value: value
            });
        }
    }
    await Api({
        method: 'patch',
        url: url,
        data: patchData
    })
        .then()
        .catch(error => {
            logger.error(`Failed updating the ticket ${id}`, error);
        });
}

export const getRecordedConversation = async (id: string) => {
    const url = `${ticketsBaseUrl}/${id}/download`;
    try {
        const response = await Api.get(url)
        return response.data;
    } catch (error) {
        logger.error(`Failed to get the recorded conversation `, error);
        return null;
    }
}

export const getPatientTickets = async (queryRequest: PatientTicketsRequest, resetPagination?: boolean) => {
    let query: any = queryRequest;
    let queryParams = serialize(query);

    if (resetPagination) {
        const { totalCount, totalPages, page, ...newQuery } = query;
        queryParams = serialize(newQuery);
    }
    let ticketsUrl = `${ticketsBaseUrl}/GetPatientTickets?${queryParams}`;
    const response = await Api.get(ticketsUrl);
    return response.data.results;
}

export const setDelete = (id: string, undoDelete?: boolean) => {
    const url = `${ticketsBaseUrl}/${id}/delete`;
    return async (dispatch: Dispatch) => {
        await Api.put(url, {
            undoDelete: undoDelete
        })
            .then(() => {
                dispatch(setTicketDelete({
                    id: id,
                    isDeleted: !!undoDelete
                }));
            })
            .catch(err => {
                dispatch(setFailure(err.message));
            });
    }
}
