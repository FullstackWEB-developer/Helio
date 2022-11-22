import {ContactTicketsRequest, PatientTicketsRequest} from '../models/patient-tickets-request';
import {Dispatch} from '@reduxjs/toolkit';
import Api from '../../../shared/services/api';
import {LookupValue} from '../models/lookup-value';
import {TicketNote} from '../models/ticket-note';
import store from '../../../app/store';
import {
    add,
    addPaging,
    endGetTicketEnumRequest,
    setFailure,
    setSearchTerm,
    setTicketEnum,
    setTicketFilter,
    setTicketListQueryType,
    setUnreadTeamTicket,
    setUnreadTicket,
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
import {FeedbackRequest} from '../models/feedback-request';
import {FeedbackResponse} from '../models/feedback-response';
import {AgentStatus, PagedList, QueueCurrentMetricQuery, QueueMetric, QuickConnectExtension} from '@shared/models';
import {CallbackTicket} from '@pages/tickets/models/callback-ticket.model';
import {PerformanceMetric} from '@pages/dashboard/models/performance-metric.model';
import axios from 'axios';
import {AgentPerformanceRequest} from '@pages/application/models/agent-performance-request';
import {AgentPerformanceResponse} from '@pages/application/models/agent-performance-response';
import {AgentContactPerformanceResponse} from '@pages/application/models/agent-contact-performance-response';
import {TicketManagerReview} from '@pages/application/models/ticket-manager-review';
import {ManagerRatingsMetricResponse} from '@pages/application/models/manager-ratings-metric-response';
import {CreateTicketFeedbackRequest} from '@pages/tickets/models/create-ticket-feedback-request';
import {PatientRatings} from '@pages/dashboard/models/patient-ratings.model';
import {TicketRatingAppliedRequest} from '../models/ticket-rating-applied-request';
import {UpdateConnectAttributesRequest} from '@pages/tickets/models/update-connect-attributes-request';
import {setUnreadSmsMessages, setUnreadTeamSms} from '@pages/sms/store/sms.slice';
import {setUnreadEmailMessages, setUnreadTeamEmail} from '@pages/email/store/email-slice';
import {BadgeValues} from '../models/badge-values.model';
import {ViewTypes} from '@pages/reports/models/view-types.enum';
import {MimeTypes} from '@shared/models/mime-types.enum';
import {ReportTypes} from '@pages/reports/models/report-types.enum';
import {BotReport} from '@pages/reports/models/bot-report.model';
import {SystemReport} from '@pages/reports/models/system-report.model';
import {CallbackTicketCountType} from '@pages/tickets/models/callback-ticket-count-type.enum';
import { TicketTypes } from '../models/ticket-types.model';

const ticketsBaseUrl = "/tickets";

export function getList(ticketQuery: TicketQuery, resetPagination?: boolean) {
    return async (dispatch: Dispatch) => {
        dispatch(setGlobalLoading(true));
        const query: any = {...ticketQuery};
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
        } catch (error: any) {
            dispatch(setFailure(error.message));

        } finally {
            dispatch(setGlobalLoading(false));
        }
    }
}

export const exportTickets = async () => {
    const query = store.getState().ticketState.ticketFilter;
    let queryParams = utils.serialize(query);
    const exportUrl = `${ticketsBaseUrl}/export?${queryParams}`;
    const response = await Api.get(exportUrl, {
        responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', response.headers["content-disposition"].split("filename=")[1]);
    document.body.appendChild(link);
    link.click();
}

export const setStatus = async ({id, status}: {id: string, status: number}): Promise<Ticket> => {
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

export interface setMultipleTicketAssigneeProps {
    ticketIdList: string[];
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

export const setMultipleTicketsAssignee = async ({ticketIdList, assignee}: setMultipleTicketAssigneeProps): Promise<Ticket[]> => {
    const url = `${ticketsBaseUrl}/assignee`;
    const result = await Api.put(url, {
        ticketIdList: ticketIdList,
        assignee: assignee
    });
    return result.data;
}

export const addNote = async ({ticketId, note}: {ticketId: string, note: TicketNote}): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${ticketId}/notes`;
    const result = await Api.post(url, note);
    return result.data;
}

export const addFeed = async ({ticketId, feed}: {ticketId: string, feed: TicketFeed}): Promise<Ticket> => {
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
                    dispatch(setTicketEnum({key: enumType, result: response.data}));
                    dispatch(endGetTicketEnumRequest(''));
                })
                .catch(() => {
                    dispatch(endGetTicketEnumRequest('ticket-new.error'));
                });
        }
    }
}

export const createTicket = async (data: Ticket): Promise<Ticket> => {
    const result = await Api.post(ticketsBaseUrl, data);
    return result.data;
}

export const createCallbackTicket = async (data: CallbackTicket): Promise<Ticket> => {
    const result = await Api.post(`${ticketsBaseUrl}/callback`, data);
    return result.data;
}

export interface updateTicketProps {
    id: string;
    ticketData: Ticket;
}

export const updateTicket = async ({id, ticketData}: updateTicketProps) => {
    const url = `${ticketsBaseUrl}/${id}`;
    let patchData: unknown[] = [];
    for (let [key, value] of Object.entries(ticketData)) {
        patchData.push({
            op: 'replace',
            path: '/' + key,
            value: value ?? null
        });
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
    const {data} = await Api.get(ticketsUrl);
    return data;
}

export const getRecordedConversation = async (id?: string): Promise<ChatTranscript | undefined> => {
    if (!id) {
        return undefined;
    }

    const url = `${ticketsBaseUrl}/${id}/recorded/download`;
    const {data} = await Api.get(url);

    return data;
}

export const getRecordedConversationLink = async (id?: string): Promise<string> => {
    if (!id) {
        return '';
    }

    const url = `${ticketsBaseUrl}/${id}/recorded/link`;
    const {data} = await Api.get(url, {
        responseType: 'text'
    });

    return data;
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

export const setDelete = async ({id, undoDelete = false}: setDeleteProps): Promise<Ticket> => {
    const url = `${ticketsBaseUrl}/${id}/delete`;
    const response = await Api.put(url, null, {
        params: {
            undoDelete: undoDelete
        }
    }
    );

    return response.data;
}

export const getTicketByNumber = async (ticketNumber: number): Promise<Ticket> => {
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


export const getQueueStatus = async (query?: QueueCurrentMetricQuery): Promise<QueueMetric[]> => {
    let url = `${ticketsBaseUrl}/dashboard/queue-metrics`;
    const response = await Api.get(url, {
        params: {
            agentUsername: query?.agentUsername,
            grouping: query?.grouping
        }
    });
    return response.data;
};

export const getAgentsStatus = async (): Promise<AgentStatus[]> => {
    let url = `${ticketsBaseUrl}/dashboard/agents-status`;
    const response = await Api.get(url);
    return response.data;
};

export const GetTodaysPerformanceMetrics = async (): Promise<PerformanceMetric[]> => {
    let url = `${ticketsBaseUrl}/dashboard/queue-history`;
    const response = await Api.get(url);
    return response.data as PerformanceMetric[];
};

export const getQuickConnects = async () => {
    const url = `${ticketsBaseUrl}/dashboard/quick-connects`;
    const response = await Api.get(url);
    return response.data as QuickConnectExtension[];
};

export const getTicketPerformanceForUser = async (request?: AgentPerformanceRequest): Promise<AgentPerformanceResponse> => {
    const url = `${ticketsBaseUrl}/dashboard/agent-ticket-performance`;
    const response = await Api.get(url, {
        params: request
    });
    return response.data;
};

export const getContactPerformanceForUser = async (userId?: string): Promise<AgentContactPerformanceResponse> => {
    const url = `${ticketsBaseUrl}/dashboard/agent-contact-performance`;
    const response = await Api.get(url, {
        params: {
            userId: userId
        }
    });
    return response.data;
};

export const getRecentManagerReviewsForUser = async (userId?: string, limit?: number): Promise<TicketManagerReview[]> => {
    const url = `${ticketsBaseUrl}/review/latest-manager-reviews`;
    const response = await Api.get(url, {
        params: {
            userId,
            limit
        }
    });
    return response.data;
};

export const getTicketReviews = async (ticketId?: string): Promise<TicketManagerReview[]> => {
    const url = `${ticketsBaseUrl}/review/${ticketId}`;
    const response = await Api.get(url);
    return response.data;
};

export const creteTicketFeedback = async (request: CreateTicketFeedbackRequest): Promise<TicketManagerReview> => {
    const url = `${ticketsBaseUrl}/review`;
    const response = await Api.post(url, request);
    return response.data;
};



export const getOverallManagerRatingsForUser = async (userId?: string): Promise<ManagerRatingsMetricResponse> => {
    const url = `${ticketsBaseUrl}/review/overall-manager-reviews`;
    const response = await Api.get(url, {
        params: {
            userId
        }
    });
    return response.data;
};

export const getFileAsBlob = async (url: string) => {
    const response = await axios.get(url, {
        responseType: 'blob'
    });
    return response.data as Blob;
}

export const creteFeedback = async (request: FeedbackRequest): Promise<FeedbackResponse> => {
    const url = `${ticketsBaseUrl}/rating`;
    const response = await Api.post(url, request);
    return response.data;
};

export const getOverallPatientReviews = async (type: DashboardTypes): Promise<PatientRatings> => {
    const url = `${ticketsBaseUrl}/rating/overall-patient-reviews`;
    const response = await Api.get(url, {
        params: {
            type
        }
    });
    return response.data;
};

export const getPatientTicketRating = async (ticketId: string) => {
    const url = `${ticketsBaseUrl}/${ticketId}/rating`;
    const response = await Api.get(url);
    return response.data;
}

export const getLatestQuickConnectData = async (): Promise<QuickConnectExtension[]> => {
    const url = `${ticketsBaseUrl}/dashboard/quick-connects`;
    const response = await Api.get(url);
    return response.data;
}

export const togglePatientRatingApplianceToTicket = async (reqBody: TicketRatingAppliedRequest) => {
    const url = `${ticketsBaseUrl}/rating/toggle-rating-applied`;
    const response = await Api.post(url, reqBody);
    return response.data;
}

export const updateConnectAttributesForInternalCall = async (request: UpdateConnectAttributesRequest) => {
    const url = `${ticketsBaseUrl}/connect/${request.contactId}/update-attributes/internal`;
    const response = await Api.put(url, request.attributes);
    return response.data;
}

export const updateConnectAttributes = async (request: UpdateConnectAttributesRequest) => {
    const url = `${ticketsBaseUrl}/connect/${request.contactId}/update-attributes`;
    const response = await Api.put(url, request.attributes);
    return response.data;
}

export function getBadgeValues(badgeValues: BadgeValues, teamBadgeValues: boolean = false) {
    let url = `${ticketsBaseUrl}/badge-values?badgeValue=${badgeValues}&teamBadgeValue=${teamBadgeValues}`;
    return async (dispatch: Dispatch) => {
        await Api.get(url).then((response) => {
            if (badgeValues === BadgeValues.All) {
                dispatch(setUnreadTicket(response.data.myValues.ticketBadgeCount));
            }
            if (badgeValues !== BadgeValues.SMSOnly) {
                dispatch(setUnreadEmailMessages(response.data.myValues.emailBadgeCount));
            }
            if (badgeValues !== BadgeValues.EmailOnly) {
                dispatch(setUnreadSmsMessages(response.data.myValues.smsBadgeCount));
            }
            if (teamBadgeValues) {
                dispatch(setUnreadTeamSms(response.data.teamValues.smsCount));
                dispatch(setUnreadTeamEmail(response.data.teamValues.emailCount));
                dispatch(setUnreadTeamTicket(response.data.teamValues.ticketCount));
            }
        });
    }
}

export const getAgentReport = async (request: ViewTypes) => {
    const url = `${ticketsBaseUrl}/reports/agents?period=${request}`;
    const response = await Api.get(url);
    return response.data;
}

export const getQueueReport = async (request: ViewTypes) => {
    const url = `${ticketsBaseUrl}/reports/queues?period=${request}`;
    const response = await Api.get(url);
    return response.data;
}

export const getSystemReport = async (request: ViewTypes): Promise<SystemReport[]> => {
    const url = `${ticketsBaseUrl}/reports/system?period=${request}`;
    const response = await Api.get(url);
    return response.data;
}

export const getBotReport = async (period: ViewTypes, startDate?: Date, endDate?: Date): Promise<BotReport> => {
    const url = `${ticketsBaseUrl}/reports/bot`;
    const params = period === ViewTypes.CustomDates ? {
        startDate,
        endDate
    } : {
        period
    };

    const response = await Api.get(url, {
        params
    });
    return response.data;
}

export const exportBotReport = async ({period, startDate, endDate}: {period: ViewTypes, startDate?: Date, endDate?: Date}): Promise<BotReport> => {
    const url = `${ticketsBaseUrl}/reports/bot/export`;
    const params = period === ViewTypes.CustomDates ? {
        startDate,
        endDate
    } : {
        period
    };

    const response = await Api.get(url, {
        params,
        responseType: 'arraybuffer'
    });
    utils.downloadFileFromData(response.data, `BotReport`, MimeTypes.XlsX);
    return response.data;
}

export const getAvailableMonths = async (reportType: ReportTypes) => {
    const url = `${ticketsBaseUrl}/reports/available-months?reportType=${reportType}`;
    const response = await Api.get(url);
    return response.data;
}

export const exportAgentReport = async ({request, selectedIds}: {request: ViewTypes, selectedIds: string[]}) => {
    const url = `${ticketsBaseUrl}/reports/agents/export?period=${request}&${selectedIds.map((n) => `selectedIds=${n}`).join('&')}`;
    const response = await Api.get(url, {
        responseType: 'arraybuffer'
    });
    utils.downloadFileFromData(response.data, `AgentReport`, MimeTypes.XlsX);
    return response.data;
}

export const exportQueueReport = async ({request, selectedIds}: {request: ViewTypes, selectedIds: string[]}) => {
    const url = `${ticketsBaseUrl}/reports/queue/export?period=${request}&${selectedIds.map((n) => `selectedIds=${n}`).join('&')}`;
    const response = await Api.get(url, {
        responseType: 'arraybuffer'
    });
    utils.downloadFileFromData(response.data, `QueueReport`, MimeTypes.XlsX);
    return response.data;
}

export const getPerformanceChart = async (request: ViewTypes) => {
    const url = `${ticketsBaseUrl}/reports/performance-chart?period=${request}`;
    const response = await Api.get(url);
    return response.data;
}

export const exportSystemReport = async ({request, selectedIds}: {request: ViewTypes, selectedIds: string[]}) => {
    const url = `${ticketsBaseUrl}/reports/system/export?period=${request}&${selectedIds.map((n) => `selectedIds=${n}`).join('&')}`;
    const response = await Api.get(url, {
        responseType: 'arraybuffer'
    });
    utils.downloadFileFromData(response.data, `SystemReport`, MimeTypes.XlsX);
}

export const getChildrenTicketNumbers = async (ticketId: string): Promise<number[]> => {
    const url = `${ticketsBaseUrl}/${ticketId}/children`;
    const response = await Api.get(url);
    return response.data;
}

export const getCallbackTicketCount = async (type :CallbackTicketCountType) : Promise<number> => {
    const url = `${ticketsBaseUrl}/callback-ticket-count`;
    const response = await Api.get(url, {
        params: {
            type
        }
    });
    return response.data;
}

export const getTicketTypes = async (): Promise<TicketTypes[]> => {
    const url = `${ticketsBaseUrl}/ticket-type`;
    const response = await Api.get(url);
    return response.data;
}

export const saveTicketTypes = async (request: TicketTypes) => {
    const url = `${ticketsBaseUrl}/ticket-type`;
    const response = await Api.put(url, request);
    return response.data;
}

export const getIntents = async () => {
    const url = `${ticketsBaseUrl}/connect/intents`;
    const response = await Api.get(url);
    return response.data;
}