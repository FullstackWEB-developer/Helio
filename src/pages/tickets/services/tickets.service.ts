import {ContactTicketsRequest, PatientTicketsRequest} from '../models/patient-tickets-request';
import {Dispatch} from '@reduxjs/toolkit';
import Api from '../../../shared/services/api';
import Logger from '../../../shared/services/logger';
import {LookupValue} from '../models/lookup-value';
import {TicketNote} from '../models/ticket-note';
import store from '../../../app/store';
import {
    add,
    addPaging,
    endGetLookupValuesRequest,
    endGetTicketEnumRequest,
    setFailure,
    setLookupValues,
    setSearchTerm,
    setTicketEnum,
    setTicketFilter,
    setTicketListQueryType,
    startGeLookupValuesRequest,
    startGetTicketEnumRequest
} from '../store/tickets.slice';
import {Ticket} from '../models/ticket';
import {Paging} from '@shared/models/paging.model';
import {TicketQuery} from '../models/ticket-query';
import {TicketFeed} from '../models/ticket-feed';
import {TicketListQueryType} from '../models/ticket-list-type';
import {DashboardTypes} from '@pages/dashboard/enums/dashboard-type.enum';
import {DashboardTimeframes} from '@pages/dashboard/enums/dashboard.timeframes';
import utils from '@shared/utils/utils';
import {setGlobalLoading} from '@shared/store/app/app.slice';
import {ChatTranscript} from '@pages/tickets/models/chat-transcript.model';
import {TicketBase} from '../models/ticket-base';
import {PagedList} from '@shared/models';

const logger = Logger.getInstance();
const ticketsBaseUrl = "/tickets";

export function getList(ticketQuery: TicketQuery, resetPagination?: boolean) {
    return async (dispatch: Dispatch) => {
        dispatch(setGlobalLoading(true));
        const query: any = ticketQuery;
        if (!isNaN(Number(ticketQuery.searchTerm))) {
            query.ticketNumber = ticketQuery.searchTerm;
        }
        let queryParams = utils.serialize(query);
        if (resetPagination) {
            const {totalCount, totalPages, page, ...newQuery} = query;
            queryParams = utils.serialize(newQuery);
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
                page: (data.page > data.totalPages && data.totalPages > 0) ? data.totalPages : data.page,
                totalCount: data.totalCount
            };
            dispatch(addPaging(paging));
            dispatch(setSearchTerm(query.searchTerm ? query.searchTerm : ''));

            const saveQuery: TicketQuery = {
                ...paging,
                ...query
            };

            if (!saveQuery.assignedTo || saveQuery.assignedTo.length < 1) {
                dispatch(setTicketListQueryType(TicketListQueryType.AllTicket));
            }

            dispatch(setTicketFilter(saveQuery));
        } catch (error) {
            dispatch(setFailure(error.message));
        } finally {
            dispatch(setGlobalLoading(false));
        }
    }
}

export const setStatus = async ({id, status}: { id: string, status: number }): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${id}/status`;
    const result = await Api.put(url, {
        id: id,
        status: status
    });
    return result.data;
}

export interface setAssigneeProps {
    ticketId: string;
    assignee: string;
}

export const setAssignee = async ({ticketId, assignee}: setAssigneeProps): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${ticketId}/assignee`;
    const result = await Api.put(url, {
        id: ticketId,
        assignee: assignee
    });
    return result.data;
}

export const addNote = async ({ticketId, note}: { ticketId: string, note: TicketNote }): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${ticketId}/notes`;
    const result = await Api.post(url, note);
    return result.data;
}

export const addFeed = async ({ticketId, feed}: { ticketId: string, feed: TicketFeed }): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${ticketId}/feed`;
    const result = await Api.post(url, feed);
    return result.data;

}

export const getEnumByType = (enumType: string) => {
    const getEnumUrl = `${ticketsBaseUrl}/lookup/${enumType}`;
    const stateEnumValues = store.getState().ticketState.enumValues?.find((a: LookupValue) => a.key === enumType) || undefined;
    return async (dispatch: Dispatch) => {
        if (!stateEnumValues) {
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
}

export const getLookupValues = (key: string) => {
    const getLookupValuesUrl = `/lookups/values/${key}`;
    const stateLookupValues = store.getState().ticketState.lookupValues?.find((a: LookupValue) => a.key === key) || undefined;
    return async (dispatch: Dispatch) => {
        if (!stateLookupValues) {
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

export const createTicket = async (data: Ticket): Promise<Ticket> => {
    const result = await Api.post(ticketsBaseUrl, data);
    return result.data;
}

export interface updateTicketProps {
    id: string;
    ticketData: Ticket;
}

export const updateTicket = async ({id, ticketData}: updateTicketProps) => {
    const url = `${ticketsBaseUrl}/${id}`;
    let patchData = [];
    for (let [key, value] of Object.entries(ticketData)) {
        if (value) {
            patchData.push({
                op: 'replace',
                path: '/' + key,
                value: value
            });
        }
    }
    const result = await Api({
        method: 'patch',
        url: url,
        data: patchData
    });
    return result.data as Ticket;
}

export const getContactTickets = async (queryRequest: ContactTicketsRequest, resetPagination?: boolean) => {
    const query: any = queryRequest;
    let queryParams = utils.serialize(query);

    if (resetPagination) {
        const {totalCount, totalPages, page, ...newQuery} = query;
        queryParams = utils.serialize(newQuery);
    }
    const ticketsUrl = `${ticketsBaseUrl}/GetContactTickets?${queryParams}`;
    const response = await Api.get(ticketsUrl);
    return response.data.results;
}

export const getRecordedConversation = async (id: string) : Promise<ChatTranscript> => {
    const url = `${ticketsBaseUrl}/${id}/download`;
    const response = await Api.get(url)
    return response.data;
}

export const getPatientTickets = async (queryRequest: PatientTicketsRequest, resetPagination?: boolean) => {
    let query: any = queryRequest;
    let queryParams = utils.serialize(query);

    if (resetPagination) {
        const {totalCount, totalPages, page, ...newQuery} = query;
        queryParams = utils.serialize(newQuery);
    }
    let ticketsUrl = `${ticketsBaseUrl}/GetPatientTickets?${queryParams}`;
    const response = await Api.get(ticketsUrl);
    return response.data.results;
}


export const getPatientTicketsPaged = async (queryRequest: PatientTicketsRequest) => {
    const ticketsUrl = `${ticketsBaseUrl}/GetPatientTickets`;
    const response = await Api.get<PagedList<TicketBase>>(ticketsUrl, {params: queryRequest});
    return response.data;
}

export interface setDeleteProps {
    id: string,
    undoDelete?: boolean;
}

export const setDelete = async ({id, undoDelete = false}: setDeleteProps) => {
    const url = `${ticketsBaseUrl}/${id}/delete`;
    await Api.put(url, {
        undoDelete: undoDelete
    })
}

export const getTicketByNumber = async (ticketNumber: number) => {
    const url = `${ticketsBaseUrl}/${ticketNumber}`;
    const response = await Api.get(url);
    return response.data;
}

export const getTicketById = async (ticketId: string) => {
    const url = `${ticketsBaseUrl}/${ticketId}`;
    const response = await Api.get(url);
    return response.data;
}

export const getDashboardData = async (type: DashboardTypes, timeFrame: DashboardTimeframes, startDate: Date, endDate: Date) => {
    let url = `${ticketsBaseUrl}/dashboard?timeFrame=${timeFrame}&type=${type}`;
    if (timeFrame === DashboardTimeframes.custom) {
        url = url + `&startDate=${utils.toISOLocalString(startDate)}&endDate=${utils.toISOLocalString(endDate)}`;
    }
    const response = await Api.get(url);
    return response.data;
}
